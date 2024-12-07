"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, env_variables, messaging } from "@/appwrite.config";
import { Appointment } from "@/types/appwrite.types";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const create_appointment = async (
  appointment_data: CreateAppointmentParams
) => {
  console.log(appointment_data);
  try {
    const appointments = await databases.listDocuments(
      env_variables.DATABASE_ID!,
      env_variables.APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("patientId", appointment_data.patientId),
        Query.equal("primaryPhysician", appointment_data.primaryPhysician),
        Query.equal("schedule", appointment_data.schedule.toISOString()),
      ]
    );

    if (appointments?.documents?.length === 0) {
      const new_appointment = await databases.createDocument(
        env_variables.DATABASE_ID!,
        env_variables.APPOINTMENT_COLLECTION_ID!,
        ID.unique(),
        appointment_data
      );

      return {
        success: true,
        title: "Appointment created successfully",
        description: "You can now view your appointment",
        data: new_appointment,
      };
    } else {
      return {
        success: false,
        title: "Appointment already exists",
        description:
          "Appointment is already booked with the same doctor at the same time",
        data: null,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      data: null,
    };
  }
};

export const get_appointment = async (appointment_id: string) => {
  console.log(appointment_id);
  try {
    const appointment = await databases.getDocument(
      env_variables.DATABASE_ID!,
      env_variables.APPOINTMENT_COLLECTION_ID!,
      appointment_id
    );
    return appointment;
  } catch (error) {
    console.log(error);
  }
};

export const get_all_appointments = async () => {
  try {
    const appointments = await databases.listDocuments(
      env_variables.DATABASE_ID!,
      env_variables.APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initial_counts = {
      schedule_count: 0,
      pending_count: 0,
      cancelled_count: 0,
    };
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.schedule_count++;
        }
        if (appointment.status === "pending") {
          acc.pending_count++;
        }
        if (appointment.status === "cancelled") {
          acc.cancelled_count++;
        }
        return acc;
      },
      initial_counts
    );

    const data = {
      documents: appointments.documents as Appointment[],
      counts,
      total_count: appointments.total,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const update_appointment = async (appointment_to_update: {
  user_id: string;
  appointment_id: string;
  appointment: {
    primary_physician: string;
    schedule: Date;
    cancellation_reason: string;
  };
  type: "schedule" | "create" | "cancel";
}) => {
  try {
    const appointment = await databases.updateDocument(
      env_variables.DATABASE_ID!,
      env_variables.APPOINTMENT_COLLECTION_ID!,
      appointment_to_update.appointment_id,
      {
        schedule: appointment_to_update.appointment.schedule,
        status:
          appointment_to_update.type === "schedule" ? "scheduled" : "cancelled",
        cancellationReason:
          appointment_to_update.appointment.cancellation_reason ?? null,
      }
    );

    const sms_message = `Hi, it's Carepulse ${
      appointment_to_update.type === "schedule"
        ? `Your appointment has been scheduled for ${appointment_to_update.appointment.schedule.toLocaleString()} with Dr. ${
            appointment_to_update.appointment.primary_physician
          } `
        : `Your appointment has been cancelled for  ${appointment_to_update.appointment.schedule.toLocaleString()} with Dr, ${
            appointment_to_update.appointment.primary_physician
          }. Reason: ${appointment_to_update.appointment.cancellation_reason}`
    }.`;

    await send_appointment_sms(appointment_to_update.user_id, sms_message);
    revalidatePath("/admin");
    return {
      success: true,
      title:
        appointment_to_update.type === "schedule"
          ? "Appointment scheduled"
          : "Appointment cancelled",
      description:
        appointment_to_update.type === "schedule"
          ? "Your appointment has been scheduled"
          : "Your appointment has been cancelled",
      data: appointment,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      data: null,
    };
  }
};

export const send_appointment_sms = async (
  user_id: string,
  content: string
) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [user_id]
    );
    return message;
  } catch (error) {
    console.log(error);
  }
};

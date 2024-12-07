/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FORMFIELD_TYPE } from "@/data/enums";
import { icons } from "@/data/assets";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";

import Image from "next/image";
import { startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  create_appointment,
  update_appointment,
} from "@/lib/actions/appointment.action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

interface NewAppointmentFormProps {
  patient_id: string;
  user_id: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setopen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({
  patient_id,
  user_id,
  type,
  appointment,
  setopen,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setloading] = useState(false);

  const AppointmentFormSchema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      schedule: appointment?.schedule
        ? new Date(appointment.schedule)
        : startOfToday(),
      primary_physician: appointment?.primaryPhysician ?? "",
      reason: appointment?.reason ?? "",
      notes: appointment?.notes ?? "",
      cancellation_reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormSchema>) => {
    console.log(patient_id, user_id, type, appointment, setopen);
    const appointment_status =
      type === "schedule"
        ? "scheduled"
        : type === "create"
        ? "pending"
        : "cancelled";

    if (type === "create" && patient_id) {
      const appointment_data: CreateAppointmentParams = {
        patientId: patient_id,
        userId: user_id,
        schedule:
          values.schedule !== undefined
            ? new Date(values.schedule)
            : new Date(),
        reason: values.reason ?? "",
        notes: values.notes ?? "",
        primaryPhysician: values.primary_physician ?? "",
        status: appointment_status,
      };
      setloading(true);
      const appointment = await create_appointment(appointment_data);

      if (appointment?.success) {
        form.reset();
        setloading(false);
        toast({
          title: appointment.title,
          description: appointment.description,
        });
        router.push(
          `/patients/${user_id}/new-appointment/success?appointmentId=${appointment.data?.$id}`
        );
      } else {
        toast({
          title: appointment?.title ?? "Error",
          description: appointment?.description ?? "An error occurred",
        });

        setloading(false);
      }
    } else if (appointment) {
      setloading(true);
      const appointment_to_update = {
        user_id,
        appointment_id: appointment.$id,
        appointment: {
          primary_physician: appointment.primaryPhysician,
          schedule:
            values.schedule !== undefined
              ? new Date(values.schedule)
              : new Date(appointment.schedule),
          status: appointment_status as Status,
          cancellation_reason: values.cancellation_reason ?? "",
        },
        type: type as "schedule" | "cancel",
      };
      console.log(appointment_to_update);

      const appointment_update = await update_appointment(
        appointment_to_update
      );
      if (appointment_update?.success) {
        form.reset();
        setloading(false);
        toast({
          title: appointment_update.title,
          description: appointment_update.description,
        });
        setopen?.(false);
      } else {
        toast({
          title: appointment_update?.title ?? "Error",
          description: appointment_update?.description ?? "An error occurred",
        });

        setloading(false);
      }
    } else if (appointment && type === "cancel") {
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          {type === "create" && (
            <section className="mb-12 space-y-4">
              <h1 className="header">Hey There</h1>
              <p className="text-dark-700">
                Request a new appointment in 10 seconds.
              </p>
            </section>
          )}

          {/* {type !== "cancel" && ( */}
          <>
            <CustomFormField
              name="primary_physician"
              control={form.control}
              label="Doctor"
              placeholder="Select Doctor"
              field_type={FORMFIELD_TYPE.SELECT}
              disabled={type === "cancel"}
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      alt={doctor.name}
                      src={doctor.image}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p> {doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div
              className="flex flex-col gap-6 xl:flex-row"
              style={{ marginTop: 18 }}
            >
              <CustomFormField
                name="schedule"
                control={form.control}
                label="Expected Appointment Date"
                placeholder="12-11-2024"
                field_type={FORMFIELD_TYPE.DATE_TIME_PICKER}
                icon={icons.calendar}
                disabled={type === "cancel"}
              />
            </div>

            <div
              className="flex flex-col gap-6 xl:flex-row"
              style={{ marginTop: 18 }}
            >
              <CustomFormField
                name="reason"
                control={form.control}
                label="Reason"
                placeholder="peanuts, milk etc"
                field_type={FORMFIELD_TYPE.TEXTAREA}
                disabled={type === "cancel"}
              />
              <CustomFormField
                name="notes"
                control={form.control}
                label="Notes"
                placeholder="paracetamol, ibuprofen etc"
                field_type={FORMFIELD_TYPE.TEXTAREA}
                disabled={type === "cancel"}
              />
            </div>
          </>
          {/* )} */}

          {type === "cancel" && (
            <div
              className="flex flex-col gap-6 xl:flex-row"
              style={{ marginTop: 18 }}
            >
              <CustomFormField
                name="cancellation_reason"
                control={form.control}
                label="Cancellation Reason"
                placeholder="peanuts, milk etc"
                field_type={FORMFIELD_TYPE.TEXTAREA}
              />
            </div>
          )}

          <SubmitButton
            is_loading={loading}
            className={cn(
              `${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"}`
            )}
          >
            {type === "create"
              ? "Create Appointment"
              : type === "cancel"
              ? "Cancel Appointment"
              : "Schedule Appointment"}
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};
export default NewAppointmentForm;

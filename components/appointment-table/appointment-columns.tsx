"use client";

import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Data = {
  schedule: string;
  primaryPhysician: string;
  userId: string;
  patientId: {
    name: string;
    $id: string;
  };
  id: string;
  status: "scheduled" | "pending" | "cancelled";
};
export const appointment_columns: ColumnDef<Data>[] = [
  {
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.patientId.name}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge
          status={row.original.status as "scheduled" | "pending" | "cancelled"}
        />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor.name === row.original.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3">
          {doctor && (
            <Image
              src={doctor.image || ""}
              alt={doctor.name || ""}
              width={100}
              height={100}
              className="size-8"
            />
          )}
          <p className="whitespace-nowrap">Dr. {doctor?.name || ""}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <>
          {
            <div className="flex gap-1">
              <AppointmentModal
                type="schedule"
                patient_id={row.original.patientId.$id}
                user_id={row.original.userId}
                appointment={row.original}
                title="Schedule Appointment"
                description="Please confirm the following details to schedule"
              />
              <AppointmentModal
                type="cancel"
                patient_id={row.original.patientId.$id}
                user_id={row.original.userId}
                appointment={row.original}
                title="Cancel Appointment"
                description="Are you sure you want to cancel this appointment?"
              />
            </div>
          }
        </>
      );
    },
  },
];

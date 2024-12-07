/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import NewAppointmentForm from "./forms/NewAppointmentForm";
const AppointmentModal = ({
  type,
  patient_id,
  user_id,
  appointment,
}: {
  type: "schedule" | "cancel";
  patient_id: string;
  user_id: string;
  title: string;
  appointment: any;
  description: string;
}) => {
  const [open, setopen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={
            (type === "schedule" && appointment?.status === "scheduled") ||
            (type === "cancel" && appointment?.status === "cancelled")
          }
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-4xl">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill out the form below to {type} an appointment.
          </DialogDescription>
        </DialogHeader>

        <NewAppointmentForm
          patient_id={patient_id}
          user_id={user_id}
          type={type}
          appointment={appointment}
          setopen={setopen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;

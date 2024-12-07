import StatCard from "@/components/StatCard";

import AppointmentDataTable from "@/components/appointment-table/AppointmentDataTable";
import { appointment_columns } from "@/components/appointment-table/appointment-columns";

import { get_all_appointments } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminPage = async () => {
  const appointments = await get_all_appointments();
  console.log(appointments);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="logo"
            width={162}
            height={32}
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome, Admin</h1>
          <p className="text-dark-700">
            Start your day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="scheduled"
            count={appointments?.counts?.schedule_count}
            label="Scheduled Appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments?.counts.pending_count}
            label="Pending Appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments?.counts.cancelled_count}
            label="Cancelled Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <AppointmentDataTable
          data={appointments.documents}
          columns={appointment_columns}
        />
      </main>
    </div>
  );
};

export default AdminPage;

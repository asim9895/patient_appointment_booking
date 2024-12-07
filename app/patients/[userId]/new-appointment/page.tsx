import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import { get_patient } from "@/lib/actions/patient.action";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

const NewAppointmetPage = async ({ params: { userId } }: SearchParamProps) => {
  const fetch_patient = await get_patient(userId);

  Sentry.metrics.set("user_new-appointment", fetch_patient.name);

  const patient_info = fetch_patient !== null ? fetch_patient : null;
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP verfication */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <NewAppointmentForm
            patient_id={patient_info?.$id}
            user_id={userId}
            type="create"
          />

          <p className="pb-8 pt-8 copyright">© 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="max-w-[30%] side-img"
      />
    </div>
  );
};

export default NewAppointmetPage;

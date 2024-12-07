import RegisterForm from "@/components/forms/RegisterForm";
import { getUserById, get_patient } from "@/lib/actions/patient.action";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

const PatientRegisterPage = async ({
  params: { userId },
}: SearchParamProps) => {
  const fetch_user = await getUserById(userId);

  Sentry.metrics.set("user_register", fetch_user.name);

  const fetch_patient = await get_patient(userId);

  const user_info =
    fetch_user !== null
      ? {
          username: fetch_user?.name,
          email: fetch_user?.email,
          phone_number: fetch_user?.phone,
          id: fetch_user?.$id,
        }
      : null;

  const patient_info: PatientInfo =
    fetch_patient !== null
      ? {
          identificationDocumentUrl: fetch_patient?.identificationDocumentUrl,
          identificationDocumentId: fetch_patient?.identificationDocumentId,
          ...fetch_patient,
        }
      : null;

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
          <RegisterForm user_info={user_info} patient_info={patient_info} />

          <p className="pb-8 pt-8 copyright">© 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src={"/assets/images/register-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="max-w-[30%] side-img"
      />
    </div>
  );
};

export default PatientRegisterPage;

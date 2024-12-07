/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FORMFIELD_TYPE } from "@/data/enums";
import { icons } from "@/data/assets";
import SubmitButton from "../SubmitButton";
import { gender_options } from "@/app/constants";
import { Doctors, IdentificationTypes } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileInput from "../inputs/FileInput";
import RadioInput from "../inputs/RadioInput";
import { useRouter } from "next/navigation";
import { register_patient } from "@/lib/actions/patient.action";
import { startOfToday } from "date-fns";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .refine(
      (phone_number) => /^\+\d{10,15}$/.test(phone_number),
      "Invalid phone number"
    ),
  birth_date: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergency_contact_email: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergency_contact_number: z
    .string()
    .refine(
      (emergency_contact_number) =>
        /^\+\d{10,15}$/.test(emergency_contact_number),
      "Invalid phone number"
    ),
  primary_physician: z.string().min(2, "Select at least one doctor"),
  insurance_provider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurance_policy_number: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  current_medications: z.string().optional(),
  family_medical_history: z.string().optional(),
  past_medical_history: z.string().optional(),
  identification_type: z.string().optional(),
  identification_number: z.string().optional(),
  identification_document: z.custom<File[]>().optional(),
  treatment_consent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosure_consent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacy_consent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

interface RegisterFormProps {
  user_info: {
    username: string;
    email: string;
    phone_number: string;
    id: string;
  } | null;
  patient_info: PatientInfo | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  user_info,
  patient_info,
}) => {
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user_info?.username,
      email: user_info?.email,
      phone_number: user_info?.phone_number,
      birth_date: startOfToday(),
      gender: patient_info?.gender ?? "Male",
      address: patient_info?.address ?? "",
      occupation: patient_info?.occupation ?? "",
      emergency_contact_email: patient_info?.emergencyContactName ?? "",
      emergency_contact_number: patient_info?.emergencyContactNumber ?? "",
      primary_physician: patient_info?.primaryPhysician ?? "",
      insurance_provider: patient_info?.insuranceProvider ?? "",
      insurance_policy_number: patient_info?.insurancePolicyNumber ?? "",
      allergies: patient_info?.allergies ?? "",
      current_medications: patient_info?.currentMedication ?? "",
      family_medical_history: patient_info?.familyMedicalHistory ?? "",
      past_medical_history: patient_info?.pastMedicalHistory ?? "",
      identification_type: patient_info?.identificationType ?? "",
      identification_number: patient_info?.identificationNumber ?? "",
      identification_document: [],
      treatment_consent: patient_info?.treatmentConsent ?? false,
      privacy_consent: patient_info?.privacyConsent ?? false,
      disclosure_consent: patient_info?.disclosureConsent ?? false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let formData;

    if (
      values.identification_document &&
      values?.identification_document?.length > 0
    ) {
      const blobFile = new Blob([values.identification_document[0]], {
        type: values.identification_document[0].type,
      });

      formData = new FormData();
      formData.append("blob_file", blobFile);
      formData.append("file_name", values.identification_document[0].name);
    }

    const patient_data: RegisterUserParams = {
      userId: user_info?.id ?? "",
      name: values.username,
      email: values.email,
      phone: values.phone_number,
      birthDate: new Date(values.birth_date),
      gender: values.gender,
      address: values.address,
      occupation: values.occupation,
      emergencyContactName: values.emergency_contact_email,
      emergencyContactNumber: values.emergency_contact_number,
      primaryPhysician: values.primary_physician,
      insuranceProvider: values.insurance_provider,
      insurancePolicyNumber: values.insurance_policy_number,
      allergies: values.allergies,
      currentMedication: values.current_medications,
      familyMedicalHistory: values.family_medical_history,
      pastMedicalHistory: values.past_medical_history,
      identificationType: values.identification_type,
      identificationNumber: values.identification_number,
      identificationDocument: formData,
      treatmentConsent: values.treatment_consent,
      disclosureConsent: values.disclosure_consent,
      privacyConsent: values.privacy_consent,
    };

    setloading(true);

    try {
      const patient = await register_patient(patient_data);

      if (patient) {
        router.push(`/patients/${user_info?.id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className="mb-12 space-y-4">
            <h1 className="header">Welcome</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>
          <CustomFormField
            name="username"
            control={form.control}
            label="Username"
            placeholder="robert_denero"
            field_type={FORMFIELD_TYPE.INPUT}
            icon={icons.user}
            // disabled={true}
          />

          <div
            className="flex flex-col gap-6 xl:flex-row"
            style={{ marginTop: 18 }}
          >
            <CustomFormField
              name="email"
              control={form.control}
              label="Email"
              placeholder="robert@gmail.com"
              field_type={FORMFIELD_TYPE.INPUT}
              icon={icons.email}
              // disabled={true}
            />
            <CustomFormField
              name="phone_number"
              control={form.control}
              label="Phone Number"
              placeholder="+919242424244"
              field_type={FORMFIELD_TYPE.PHONE_NUMBER}
            />
          </div>
          <div
            className="flex flex-col gap-6 xl:flex-row"
            style={{ marginTop: 18 }}
          >
            <CustomFormField
              name="birth_date"
              control={form.control}
              label="Date Of Birth"
              placeholder="12-11-2024"
              field_type={FORMFIELD_TYPE.DATE_PICKER}
              icon={icons.calendar}
            />
            <CustomFormField
              name="gender"
              control={form.control}
              label="Gender"
              field_type={FORMFIELD_TYPE.SKELETON}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderSkeleton={(field: any) => (
                <RadioInput field={field} options={gender_options} />
              )}
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <CustomFormField
              name="address"
              control={form.control}
              label="Address"
              placeholder="14 street, near chinese plaza, new york"
              field_type={FORMFIELD_TYPE.TEXTAREA}
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <CustomFormField
              name="occupation"
              control={form.control}
              label="Occupation"
              placeholder="Software Engineer"
              field_type={FORMFIELD_TYPE.INPUT}
            />
          </div>

          <div
            className="flex flex-col gap-6 xl:flex-row"
            style={{ marginTop: 18 }}
          >
            <CustomFormField
              name="emergency_contact_email"
              control={form.control}
              label="Emergency Contact Email"
              placeholder="robert@gmail.com"
              field_type={FORMFIELD_TYPE.INPUT}
              icon={icons.email}
            />
            <CustomFormField
              name="emergency_contact_number"
              control={form.control}
              label="Emergency Contact Number"
              placeholder="+919242424244"
              field_type={FORMFIELD_TYPE.PHONE_NUMBER}
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>

          <CustomFormField
            name="primary_physician"
            control={form.control}
            label="Primary Physician"
            placeholder="Select Physician"
            field_type={FORMFIELD_TYPE.SELECT}
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
              name="insurance_provider"
              control={form.control}
              label="Insurance Provider"
              placeholder="United Health Care"
              field_type={FORMFIELD_TYPE.INPUT}
            />
            <CustomFormField
              name="insurance_policy_number"
              control={form.control}
              label="Insurance Policy Number"
              placeholder="123456789"
              field_type={FORMFIELD_TYPE.INPUT}
            />
          </div>
          <div
            className="flex flex-col gap-6 xl:flex-row"
            style={{ marginTop: 18 }}
          >
            <CustomFormField
              name="allergies"
              control={form.control}
              label="Allergies"
              placeholder="peanets, milk etc"
              field_type={FORMFIELD_TYPE.TEXTAREA}
            />
            <CustomFormField
              name="current_medications"
              control={form.control}
              label="Current Medications"
              placeholder="paracetamol, ibuprofen etc"
              field_type={FORMFIELD_TYPE.TEXTAREA}
            />
          </div>
          <div
            className="flex flex-col gap-6 xl:flex-row"
            style={{ marginTop: 18 }}
          >
            <CustomFormField
              name="family_medical_history"
              control={form.control}
              label="Family Medical History"
              placeholder="Alzheimer's, diabetes etc"
              field_type={FORMFIELD_TYPE.TEXTAREA}
            />
            <CustomFormField
              name="past_medical_history"
              control={form.control}
              label="Past Medical History"
              placeholder="Cancer, heart disease etc"
              field_type={FORMFIELD_TYPE.TEXTAREA}
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>
          </section>

          <CustomFormField
            name="identification_type"
            control={form.control}
            label="Identification Type"
            placeholder="Passport"
            field_type={FORMFIELD_TYPE.SELECT}
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <div style={{ marginTop: 18 }}>
            <CustomFormField
              name="identification_number"
              control={form.control}
              label="Identification Number"
              placeholder="123456789"
              field_type={FORMFIELD_TYPE.INPUT}
            />
          </div>
          <div style={{ marginTop: 18 }}>
            <CustomFormField
              name="identification_document"
              control={form.control}
              label="Identification Document"
              field_type={FORMFIELD_TYPE.SKELETON}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderSkeleton={(field: any) => (
                <FormControl>
                  <FileInput files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </div>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>
          </section>

          <div style={{ margin: 18 }}>
            <CustomFormField
              name="treatment_consent"
              control={form.control}
              label="I consent to the treatment of my medical condition."
              field_type={FORMFIELD_TYPE.CHECKBOX}
            />
          </div>
          <div style={{ margin: 18 }}>
            <CustomFormField
              name="disclosure_consent"
              control={form.control}
              label="I consent to my personal information being used for the purpose of providing medical services."
              field_type={FORMFIELD_TYPE.CHECKBOX}
            />
          </div>
          <div style={{ margin: 18 }}>
            <CustomFormField
              name="privacy_consent"
              control={form.control}
              label="I consent to privacy policies and terms of use."
              field_type={FORMFIELD_TYPE.CHECKBOX}
            />
          </div>
          <SubmitButton is_loading={loading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};
export default RegisterForm;

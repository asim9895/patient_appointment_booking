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
import { createUser } from "@/lib/actions/patient.action";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(50, "Username cannot be more than 50 characters"),
  email: z.string().email().min(1, "Email is required"),
  phone_number: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

const PatientForm = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setloading(true);

    const userData = {
      email: values.email,
      phone: values.phone_number,
      name: values?.username,
    };

    const user = await createUser(userData);
    console.log(user);

    if (user) {
      setloading(false);
      router.push(`/patients/${user.$id}/register`);
    } else {
      console.log("User not created");
      setloading(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className="mb-12 space-y-4">
            <h1 className="header">Hii There</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
          </section>
          <CustomFormField
            name="username"
            control={form.control}
            label="Username"
            placeholder="robert_denero"
            field_type={FORMFIELD_TYPE.INPUT}
            icon={icons.user}
          />
          <CustomFormField
            name="email"
            control={form.control}
            label="Email"
            placeholder="robert@gmail.com"
            field_type={FORMFIELD_TYPE.INPUT}
            icon={icons.email}
          />
          <CustomFormField
            name="phone_number"
            control={form.control}
            label="Phone Number"
            placeholder="+919242424244"
            field_type={FORMFIELD_TYPE.PHONE_NUMBER}
          />

          <SubmitButton is_loading={loading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;

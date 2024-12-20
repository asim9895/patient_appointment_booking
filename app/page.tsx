import PasskeyModal from "@/components/PasskeyModal";
import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

const MainPage = async ({ searchParams }: SearchParamProps) => {
  const is_admin = searchParams?.admin === "true";
  console.log(process.env.NEXT_PUBLIC_PASS_KEY);
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP verfication */}
      {is_admin && <PasskeyModal />}
      <section className="remove-sidebar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePulse
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src={"/assets/images/onboarding-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="max-w-[50%] side-img"
      />
    </div>
  );
};

export default MainPage;

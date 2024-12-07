"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setopen] = useState(true);
  const [pass_key, setpass_key] = useState("");
  const [error, seterror] = useState("");

  const set_open = () => {
    setopen(true);
  };

  const set_close = () => {
    setopen(false);
    router.push("/");
  };

  const encrypted_pass_key =
    typeof window !== "undefined"
      ? window.localStorage.getItem("pass_key")
      : null;

  useEffect(() => {
    console.log(
      encrypted_pass_key !== undefined &&
        encrypted_pass_key !== null &&
        decryptKey(encrypted_pass_key),
      process.env.NEXT_PUBLIC_PASS_KEY,
      encrypted_pass_key
    );
    if (path) {
      if (
        encrypted_pass_key !== undefined &&
        encrypted_pass_key !== null &&
        decryptKey(encrypted_pass_key) === process.env.NEXT_PUBLIC_PASS_KEY
      ) {
        setopen(false);
        router.push("/admin");
      } else {
        setopen(true);
      }
    }
  }, [encrypted_pass_key, path, router]);

  const validate_pass_key = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (pass_key.length !== 6) {
      seterror("Invalid pass key, try again");
    } else if (pass_key !== process.env.NEXT_PUBLIC_PASS_KEY) {
      seterror("Invalid pass key, try again");
    } else {
      const encrypted_pass_key = encryptKey(pass_key);
      localStorage.setItem("pass_key", encrypted_pass_key);
      setopen(false);
      router.push("/admin");
    }
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={set_open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-start justify-between">
              Admin Access Vertification
            </AlertDialogTitle>
            <AlertDialogDescription>
              To access the admin page, please enter your passkey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center items-center mt-4">
            <InputOTP
              maxLength={6}
              value={pass_key}
              onChange={(value) => setpass_key(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  index={1}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  index={2}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  index={4}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  index={5}
                  className="border-gray-600 size-14 mx-2 text-2xl"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && (
            <div className="flex shad-error text-14-regular justify-center mb-4 ">
              {error}
            </div>
          )}
          <div className="flex items-center justify-center">
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-dark-300 border-x-dark-500 hover:bg-dark-300"
                onClick={set_close}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="shad-primary-btn "
                onClick={(e) => validate_pass_key(e)}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasskeyModal;

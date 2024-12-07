import { SubmitButtonProps } from "@/data/interfaces";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { icons } from "@/data/assets";

const SubmitButton: React.FC<SubmitButtonProps> = ({
  is_loading,
  children,
  className,
}) => {
  return (
    <Button
      disabled={is_loading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {is_loading ? (
        <div className="flex items-center gap-4">
          <Image
            src={icons.loader}
            width={24}
            height={24}
            alt="loader"
            className="animate-spin"
          />
          Loading
        </div>
      ) : (
        <div>{children}</div>
      )}
    </Button>
  );
};

export default SubmitButton;

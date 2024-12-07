import Image from "next/image";
import React from "react";
import { FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { CustomFormFieldProps } from "@/data/interfaces";
import { ControllerRenderProps } from "react-hook-form";

const TextInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  return (
    <div className="flex rounded-md border border-dark-500 bg-dark-400">
      {props.icon && (
        <Image
          src={props.icon}
          height={24}
          width={24}
          alt={"icon"}
          className="ml-2"
        />
      )}
      <FormControl>
        <Input
          placeholder={props.placeholder}
          {...field}
          type={"text"}
          className="border-0 shad-input"
        />
      </FormControl>
    </div>
  );
};

export default TextInput;

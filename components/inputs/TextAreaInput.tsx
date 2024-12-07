import React from "react";
import { FormControl } from "../ui/form";
import { CustomFormFieldProps } from "@/data/interfaces";
import { ControllerRenderProps } from "react-hook-form";
import { Textarea } from "../ui/textarea";

const TextAreaInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  return (
    <div className="flex rounded-md border border-dark-500 bg-dark-400">
      <FormControl>
        <Textarea
          placeholder={props.placeholder}
          {...field}
          className="border-0 shad-input"
        />
      </FormControl>
    </div>
  );
};

export default TextAreaInput;

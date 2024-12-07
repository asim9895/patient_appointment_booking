import React from "react";
import { FormControl } from "../ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { CustomFormFieldProps } from "@/data/interfaces";
import { Checkbox } from "../ui/checkbox";

const CheckBoxInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  return (
    <FormControl>
      <div className="flex items-center gap-4">
        <Checkbox
          id={props.name}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
        <label htmlFor={props.name} className="checkbox-label">
          {props.label}
        </label>
      </div>
    </FormControl>
  );
};

export default CheckBoxInput;

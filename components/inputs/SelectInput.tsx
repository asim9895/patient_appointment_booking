import { CustomFormFieldProps } from "@/data/interfaces";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";

const SelectInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger
          className="shad-select-trigger"
          disabled={props.disabled}
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent className="shad-select-content">
        {props.children}
      </SelectContent>
    </Select>
  );
};

export default SelectInput;

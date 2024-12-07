import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FormControl } from "../ui/form";
import { CustomFormFieldProps } from "@/data/interfaces";
import { E164Number } from "libphonenumber-js/core";
import { ControllerRenderProps } from "react-hook-form";

const PhoneNumberInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  return (
    <FormControl>
      <PhoneInput
        defaultCountry="IN"
        international
        disabled={props.disabled}
        countryCallingCodeEditable
        value={field.value as E164Number | undefined}
        placeholder={props.placeholder}
        onChange={field.onChange}
        className="input-phone"
      />
    </FormControl>
  );
};

export default PhoneNumberInput;

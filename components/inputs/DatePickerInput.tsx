import { CustomFormFieldProps } from "@/data/interfaces";
import Image from "next/image";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { DateTimePicker } from "../ui/datetime-picker";

const DatePickerInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ field, props }) => {
  return (
    <div className="flex rounded-md border border-dark-500 bg-dark-400">
      <Image
        src={"/assets/icons/calendar.svg"}
        width={24}
        height={24}
        alt="calendar"
        className="ml-2"
      />

      <DateTimePicker
        value={field.value}
        disabled={props.disabled}
        onChange={field.onChange}
        granularity="day"
      />
    </div>
  );
};

export default DatePickerInput;

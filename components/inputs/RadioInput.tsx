/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FormControl } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";
import { Label } from "../ui/label";

const RadioInput: React.FC<{
  field: ControllerRenderProps<any, string>;
  options: any;
}> = ({ field, options }) => {
  return (
    <FormControl>
      <RadioGroup
        className="flex h-11 gap-6 xl:justify-between"
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        {options?.map((option: any) => {
          return (
            <div key={option} className="radio-group">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="cursor-pointer">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioInput;

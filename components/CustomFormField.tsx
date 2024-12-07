import React from "react";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FORMFIELD_TYPE } from "@/data/enums";
import { CustomFormFieldProps } from "@/data/interfaces";
import RenderField from "./RenderField";

const CustomFormField: React.FC<CustomFormFieldProps> = (props) => {
  const { control, name, description, label, field_type, disabled } = props;
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="flex-1">
          {field_type !== FORMFIELD_TYPE.CHECKBOX && label && (
            <FormLabel>{props.label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default CustomFormField;

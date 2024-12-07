import React from "react";
import { CustomFormFieldProps } from "@/data/interfaces";
import { FORMFIELD_TYPE } from "@/data/enums";
import TextInput from "./inputs/TextInput";
import PhoneNumberInput from "./inputs/PhoneNumberInput";
import { ControllerRenderProps } from "react-hook-form";
import TextAreaInput from "./inputs/TextAreaInput";
import SelectInput from "./inputs/SelectInput";
import CheckBoxInput from "./inputs/CheckBoxInput";
import DateTimePickerInput from "./inputs/DateTimePickerInput";
import DatePickerInput from "./inputs/DatePickerInput";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RenderField: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomFormFieldProps;
}> = ({ field, props }) => {
  switch (props.field_type) {
    case FORMFIELD_TYPE.INPUT:
      return <TextInput field={field} props={props} />;
    case FORMFIELD_TYPE.TEXTAREA:
      return <TextAreaInput field={field} props={props} />;
    case FORMFIELD_TYPE.PHONE_NUMBER:
      return <PhoneNumberInput field={field} props={props} />;
    case FORMFIELD_TYPE.DATE_PICKER:
      return <DatePickerInput field={field} props={props} />;
    case FORMFIELD_TYPE.DATE_TIME_PICKER:
      return <DateTimePickerInput field={field} props={props} />;
    case FORMFIELD_TYPE.SELECT:
      return <SelectInput field={field} props={props} />;
    case FORMFIELD_TYPE.CHECKBOX:
      return <CheckBoxInput field={field} props={props} />;
    case FORMFIELD_TYPE.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      break;
  }
};
export default RenderField;

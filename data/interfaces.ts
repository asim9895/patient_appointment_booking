import { Control } from "react-hook-form";
import { FORMFIELD_TYPE } from "./enums";

export interface CustomFormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any> | undefined;
  field_type: FORMFIELD_TYPE;
  label?: string;
  name: string;
  placeholder?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: string;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSkeleton?: (field: any) => React.ReactNode;
}

export interface SubmitButtonProps {
  is_loading: boolean;
  className?: string;
  children: React.ReactNode;
}

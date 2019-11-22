import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { TextFieldProps } from "@material-ui/core/TextField";

export interface IBaseProps<T>
  extends Omit<AutocompleteProps, "onChange" | "renderInput" | "options"> {
  textProp: (option: T) => string;
  keyProp: (option: T) => any;
  onChange?: (e: React.ChangeEvent<{}>, value: any) => void;
  textFieldProps?: TextFieldProps;
  highlightQuery?: boolean;
  highlightQueryStyle?: React.CSSProperties;
}

export interface IOptionArrayProps<T> extends IBaseProps<T> {
  variant?: "default";
  options?: T[];
}

export interface IAsyncOptionArrayProps<T> extends IBaseProps<T> {
  variant: "async";
  onLoadOptions: (query: string) => Promise<T[]>;
  valueToOption: (value: any) => Promise<T>;
  debounceOnLoadOptions?: number;
}

import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { TextFieldProps } from "@material-ui/core/TextField";

export interface IBaseProps<T>
  extends Omit<AutocompleteProps, "onChange" | "renderInput" | "options"> {
  /**
   * should return text which should be displayed when option is selected and in list of options
   */
  textProp: (option: T) => string;
  /**
   * should return property of option that should be used to compare two options and which should be returned by onChange as value
   * if the whole object should be returned in onChange as value just give define (o)=>o as keyProp
   */
  keyProp: (option: T) => any;
  /**
   * called when option has been selected
   */
  onChange?: (e: React.ChangeEvent<{}>, value: any) => void;
  /**
   * properties which will be passed to the input
   */
  textFieldProps?: TextFieldProps;
  /**
   * set to true if current query should be highlighted in option list
   */
  highlightQuery?: boolean;
  /**
   * style that should be applied to the part of the option that matches the current query
   */
  highlightQueryStyle?: React.CSSProperties;
}

export interface IOptionArrayProps<T> extends IBaseProps<T> {
  variant?: "default";
  /**
   * list of options
   */
  options?: T[];
}

export interface IAsyncOptionArrayProps<T> extends IBaseProps<T> {
  variant: "async";
  /**
   * should return options for the given query
   */
  onLoadOptions: (query: string) => Promise<T[]>;
  /**
   * should return the whole option for the given key
   */
  keyToOption: (value: any) => Promise<T>;
  /**
   * defines who long the onLoadOptions call is debounced after the user types in the input
   * defaults to 1500 ms
   */
  debounceOnLoadOptions?: number;
}

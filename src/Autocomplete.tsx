import * as React from "react";
import { IAsyncOptionArrayProps, IOptionArrayProps } from "./types";
import { DefaultAutocomplete } from "./DefaultAutocomplete";
import { AsyncAutocomplete } from "./AsyncAutocomplete";

export type AutocompleteProps<T> =
  | IOptionArrayProps<T>
  | IAsyncOptionArrayProps<T>;

export function Autocomplete<T>(props: AutocompleteProps<T>) {
  if (props.variant === "async") {
    return <AsyncAutocomplete<T> {...props} />;
  } else {
    return <DefaultAutocomplete<T> {...props} />;
  }
}

import * as React from "react";
import { IOptionArrayProps } from "./types";
import Autocomplete, { RenderOptionState } from "@material-ui/lab/Autocomplete";
import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { TextField } from "@material-ui/core";
import { stringCompare } from "./utils";
import { HighlightQuery } from "@dccs/utils";

export function DefaultAutocomplete<T>(props: IOptionArrayProps<T>) {
  const {
    onChange,
    variant,
    onInputChange,
    textFieldProps,
    keyProp,
    textProp,
    options,
    value,
    highlightQuery,
    highlightQueryStyle,
    ...others
  } = props;

  const [selectedOption, setSelectedOption] = React.useState<T | undefined>(
    keyToOption(value)
  );
  const [inputValue, setInputValue] = React.useState<string>("");

  function keyToOption(key: any) {
    if (key) {
      if (options && options.length > 0) {
        const option = options.find(o => getKeyFromOption(o) === key);
        if (option) {
          return option;
        }
      }
    }
    return undefined;
  }

  function handleChange(e: React.ChangeEvent<{}>, option: T) {
    setSelectedOption(option);
    if (onChange) {
      onChange(e, option ? getKeyFromOption(option) : undefined);
    }
  }

  function handleInputChange(e: React.ChangeEvent<{}>, query: string) {
    setInputValue(query || "");
    if (onInputChange) {
      onInputChange(e, query);
    }
  }

  function getTextFromOption(option: any) {
    const text = textProp(option as T);
    if (text) {
      return text;
    }
    // tslint:disable-next-line: no-console
    console.error(
      `@dccs/react-autocomplete-mui: TextProp returned undefiend or null!`,
      option
    );
    return option.toString ? (option.toString() as string) : "";
  }

  function getKeyFromOption(option: any) {
    const key = keyProp(option as T);
    if (key) {
      return key;
    }
    // tslint:disable-next-line: no-console
    console.error(
      `@dccs/react-autocomplete-mui: KeyProp returned undefiend or null!`,
      option
    );
  }

  function renderOption(option: any, state: RenderOptionState) {
    if (option) {
      if (highlightQuery) {
        return (
          // <MenuItem selected={state.selected}>
          HighlightQuery(
            getTextFromOption(option),
            state.inputValue,
            highlightQueryStyle
          )
          // </MenuItem>
        );
      }
      return (
        // <MenuItem selected={state.selected}>
        getTextFromOption(option)
        // </MenuItem>
      );
    }
    return "";
  }

  function handleGetOptionLabel(option: any) {
    if (option) {
      return getTextFromOption(option);
    }
    return "";
  }

  function handleFilterOptions(oArray: T[], state: FilterOptionsState) {
    if (inputValue) {
      return oArray.filter(o =>
        stringCompare(getTextFromOption(o), inputValue)
      );
    } else {
      return oArray;
    }
  }

  return (
    <Autocomplete
      getOptionLabel={handleGetOptionLabel}
      renderOption={renderOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      value={selectedOption}
      filterOptions={handleFilterOptions}
      renderInput={params => (
        <TextField {...params} autoComplete="off" {...textFieldProps} />
      )}
      {...others}
    />
  );
}

import * as React from "react";
import { IAsyncOptionArrayProps } from "./types";
import { useDebounce } from "use-debounce";
import Autocomplete, { RenderOptionState } from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { HighlightQuery } from "@dccs/utils";

export function AsyncAutocomplete<T>(props: IAsyncOptionArrayProps<T>) {
  const {
    onChange,
    variant,
    onInputChange,
    textFieldProps,
    keyProp,
    textProp,
    value,
    highlightQuery,
    highlightQueryStyle,
    onLoadOptions,
    debounceOnLoadOptions,
    keyToOption,
    loading,
    ...others
  } = props;

  const [options, setOptions] = React.useState<T[] | undefined>();
  const [loadingOptions, setLoadingOptions] = React.useState<boolean>(false);
  const [loadingValue, setLoadingValue] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<T | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [debouncedQuery] = useDebounce(
    inputValue,
    debounceOnLoadOptions || 1500
  );
  const [oldValue, setOldValue] = React.useState<any>();

  function handleChange(e: React.ChangeEvent<{}>, option: T) {
    setSelectedOption(option);
    if (onChange) {
      onChange(e, option ? getKeyFromOption(option) : undefined);
    }
  }

  function handleInputChange(e: React.ChangeEvent<{}>, query: string) {
    if (query !== inputValue) {
      setLoadingOptions(true);
      setInputValue(query || "");
    }
    if (onInputChange) {
      onInputChange(e, query);
    }
  }

  function getTextFromOption(option: any) {
    if (option === null) {
      return "";
    }
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
    if (option === null) {
      return;
    }
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

  function handleLoadOptions(query: string) {
    onLoadOptions(query).then(
      res => {
        setOptions(res);
        setLoadingOptions(false);
      },
      err => {
        // tslint:disable-next-line: no-console
        console.error(
          `@dccs/react-autocomplete-mui: Promise returned by onLoadOptions(${query}) was rejected!`,
          `Reason:`,
          err
        );
      }
    );
  }

  async function handleKeyToOption(key: any) {
    if (options && options.length > 0) {
      const option = options.find(o => getKeyFromOption(o) === key);
      if (option) {
        return option;
      }
    }
    return await keyToOption(key);
  }

  function handleValueChanged() {
    if (value) {
      if (value === oldValue) {
        return;
      }
      setLoadingValue(true);
      setOldValue(value);

      handleKeyToOption(value).then(
        res => {
          if (res) {
            setInputValue(getKeyFromOption(res));
          }
          setSelectedOption(res || null);
          setLoadingValue(false);
        },
        err => {
          // tslint:disable-next-line: no-console
          console.error(
            `@dccs/react-autocomplete-mui: Promise returned by keyToOption(${value}) was rejected!`,
            `Reason:`,
            err
          );
        }
      );
    } else if (others.disableClearable !== true) {
      setSelectedOption(null);
    }
  }

  React.useEffect(() => {
    handleValueChanged();
  }, []);

  React.useEffect(() => {
    handleLoadOptions(debouncedQuery);
  }, [debouncedQuery]);

  React.useEffect(() => {
    handleValueChanged();
  }, [value]);

  return (
    <Autocomplete
      getOptionLabel={handleGetOptionLabel}
      renderOption={renderOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options || []}
      value={selectedOption}
      filterOptions={x => x}
      loading={loadingOptions || loadingValue || loading}
      renderInput={params => (
        <TextField {...params} autoComplete="off" {...textFieldProps} />
      )}
      {...others}
    />
  );
}

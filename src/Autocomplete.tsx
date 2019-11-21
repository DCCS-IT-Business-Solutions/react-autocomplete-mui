import * as React from "react";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";
import {
  AutocompleteProps as MuiAutocompleteProps,
  RenderOptionState
} from "@material-ui/lab/Autocomplete";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { HighlightQuery } from "@dccs/utils";
import { Typography, MenuItem } from "@material-ui/core";
import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { string } from "prop-types";

interface IBaseProps<T>
  extends Omit<MuiAutocompleteProps, "onChange" | "renderInput"> {
  value?: any;
  textProp: (option: T) => string;
  keyProp: (option: T) => any;
  onChange?: (e: React.ChangeEvent<{}>, value: any) => void;
  textFieldProps?: TextFieldProps;
  highlightQuery?: boolean;
  highlightQueryStyle?: React.CSSProperties;
}

interface IOptionArrayProps<T> extends IBaseProps<T> {
  variant?: "default";
  options?: T[];
}

interface IAsyncOptionArrayProps<T> extends IBaseProps<T> {
  variant: "async";
  onLoadOptions: (query: string) => Promise<T[]>;
  valueToOption: (value: any) => T | Promise<T>;
}

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

function DefaultAutocomplete<T>(props: IOptionArrayProps<T>) {
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

  function handleChange(e: React.ChangeEvent<{}>, value: T) {
    setSelectedOption(value);
    if (onChange) {
      onChange(e, value ? getKeyFromOption(value) : undefined);
    }
  }

  function handleInputChange(e: React.ChangeEvent<{}>, value: string) {
    setInputValue(value || "");
    if (onInputChange) {
      onInputChange(e, value);
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
    <MuiAutocomplete
      getOptionLabel={handleGetOptionLabel}
      renderOption={renderOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      value={selectedOption}
      filterOptions={handleFilterOptions}
      renderInput={params => (
        <TextField
          {...params}
          autoComplete="off"
          margin="normal"
          style={{ minWidth: "240px" }}
          {...textFieldProps}
        />
      )}
      {...others}
    />
  );
}

function AsyncAutocomplete<T>(props: IAsyncOptionArrayProps<T>) {
  const { onChange, variant, onInputChange, textFieldProps, ...others } = props;

  function handleChange(e: React.ChangeEvent<{}>, value: T) {
    if (onChange) {
      onChange(e, value);
    }
  }

  function handleInputChange(e: React.ChangeEvent<{}>, value: string) {
    if (onInputChange) {
      onInputChange(e, value);
    }
  }

  return (
    <MuiAutocomplete
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={params => (
        <TextField
          {...params}
          margin="normal"
          style={{ minWidth: "240px" }}
          {...textFieldProps}
        />
      )}
      {...others}
    />
  );
}

function stringCompare(a: string, b: string) {
  if (a === b) {
    return true;
  }
  if (a.toLowerCase().includes(b.toLowerCase())) {
    return true;
  }
  return false;
}
// export function Autocomplete(props: AutocompleteProps) {

//   const [debouncedInputValue] = useDebounce<string>(inputValue || "", 500);
//   //#region
//   // function handleTextFieldChange(
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   //   value: string
//   // ) {
//   //   setLoading(true);
//   //   setInputValue(value);
//   //   if (onInputChange) {
//   //     onInputChange(e, value);
//   //   }
//   // }

//   // function handleChange(e: React.ChangeEvent<{}>, value: any) {
//   //   if (!value) {
//   //     if (!others.disableClearable && onChange) {
//   //       onChange(e, undefined);
//   //     }
//   //     return;
//   //   } else {
//   //     if (onChange) {
//   //       onChange(e, valueProp ? valueProp(value) : value);
//   //     }
//   //   }
//   // }

//   // async function handleGetOptionLabel(current: any) {
//   //   if (current) {
//   //     const option = await valueToOption(current);
//   //     if (option) {
//   //       if (option !== current) {
//   //         if (textProp) {
//   //           return textProp(option);
//   //         }
//   //       }
//   //       return option.toString();
//   //     } else {
//   //       // tslint:disable-next-line: no-console
//   //       console.error(`valueToOption(${current}) returned undefiend!`);
//   //       return current.toString();
//   //     }
//   //   }
//   //   return "";
//   // }
//   //#endregion

//    return <MuiAutocomplete
//             // TODO: KeyPropFn & valuePropFn
//             value={options.find(element => element.key === value)}
//             onChange={(event: any, value: any) => {
//               if (value != null) {
//                 form.setFieldValue(name, value.key);
//               } else {
//                 form.setFieldValue(name, "");
//               }
//             }}
//             // TODO: Touched setzen für Error Message
//             // TODO: Async testen
//             options={options}
//             getOptionLabel={(option: any) => option.value}
//             renderInput={(params: RenderInputParams) => {
//               return (
//                 <TextField
//                   {...params}
//                   variant={variant as any}
//                   {...defaultProps}
//                   error={hasError(name, form, error)}
//                   helperText={getHelperText(name, form, helperText)}
//                   {...others}
//                 />
//               );
//             }}
//             {...autocompleteProps}
//           />
//   // return (
//   //   <MuiAutocomplete
//   //     autoSelect
//   //     getOptionLabel={handleGetOptionLabel}
//   //     filterOptions={filterOptions => filterOptions}
//   //     options={options}
//   //     loading={loading}
//   //     {...others}
//   //     value={value}
//   //     onChange={onChange ? handleChange : undefined}
//   //     onInputChange={handleTextFieldChange}
//   //     renderInput={params => (
//   //       <TextField
//   //         label={label}
//   //         {...params}
//   //         {...textFieldProps}
//   //         style={{
//   //           minWidth: "240px",
//   //           ...(textFieldProps && textFieldProps.style)
//   //         }}
//   //         // inputProps={{
//   //         //   // ...params.InputProps,
//   //         //   endAdornment: (
//   //         //     <InputAdornment position="end">
//   //         //       {loading ? (
//   //         //         <CircularProgress color="inherit" size={20} />
//   //         //       ) : null}
//   //         //       {/* {params.InputProps.endAdornment} */}
//   //         //     </InputAdornment>
//   //         //   )
//   //         // }}
//   //       />
//   //     )}
//   //   />
//   );
// }

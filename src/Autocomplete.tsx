import * as React from "react";

import {
  TextField,
  List,
  ListItem,
  Popper,
  Paper,
  Fade,
  CircularProgress,
  InputAdornment
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { TextFieldProps } from "@material-ui/core/TextField";
import { HighlightQuery } from "@dccs/utils";
import { useDebounce } from "use-debounce";

export interface IAutocompleteBaseProps {
  onOptionSelected?: (value: any) => void;
  onLoadOptions: (query: string) => Promise<any[]> | any[];
  renderOption?: (element: any, query: string) => React.ReactNode;
  renderNoOptionsFound?: () => React.ReactNode;
  maxShownOptions?: number;
  maxHeightOptionsList?: number;
  textProp?: (option: any) => string;
  valueProp?: (option: any) => string | number | any;
}

export type IAutocompleteProps = IAutocompleteBaseProps & TextFieldProps;

export function Autocomplete(props: IAutocompleteProps) {
  const newProps = { ...Autocomplete.defaultProps, ...props };
  const {
    onOptionSelected,
    onLoadOptions,
    renderOption,
    renderNoOptionsFound,
    maxShownOptions,
    maxHeightOptionsList,
    textProp,
    valueProp,
    value,
    ...others
  } = newProps;

  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<any[]>();
  const [textFieldValue, setTextFieldValue] = React.useState(
    textProp(value || "")
  );
  const [highlightedOption, setHighlightedOption] = React.useState<number>(0);
  const [debouncedQuery] = useDebounce<string>(textFieldValue, 500);

  const textFieldRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case 40: // down arrow
        e.stopPropagation();
        if (
          (suggestions != null &&
            suggestions.length <= highlightedOption + 1) ||
          (maxShownOptions && maxShownOptions <= highlightedOption + 1)
        ) {
          setHighlightedOption(0);
        } else {
          setHighlightedOption(highlightedOption + 1);
        }
        break;
      case 38: // up arrow
        e.stopPropagation();
        if (highlightedOption === 0) {
          if (maxShownOptions) {
            setHighlightedOption(maxShownOptions - 1);
          } else if (suggestions) {
            setHighlightedOption(suggestions.length - 1);
          }
        } else {
          setHighlightedOption(highlightedOption - 1);
        }
        break;
      case 13: // enter
      case 9: // tab
        e.stopPropagation();
        e.preventDefault();
        if (suggestions) {
          const element = suggestions[highlightedOption];
          onOptionSelected(valueProp(element));
        }
        if (textFieldRef.current != null) {
          textFieldRef.current.blur();
        }
        setIsFocused(false);
        break;
      case 27: // esc
        e.stopPropagation();
        if (textFieldRef.current != null) {
          textFieldRef.current.blur();
        }
        setIsFocused(false);
        break;
    }
  }

  const allSuggestions = React.useMemo(() => {
    return onLoadOptions("");
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      setLoading(true);
    }
  }, [textFieldValue]);

  async function loadOptions(query: string) {
    const result = await onLoadOptions(query || "");
    setSuggestions(result);
    setLoading(false);
  }

  async function setValueAsTextFieldValue() {
    setLoading(true);
    if (allSuggestions) {
      const result = await allSuggestions;
      const selectedSuggestions = result.find(o => valueProp(o) === value);
      if (selectedSuggestions) {
        setTextFieldValue(textProp(selectedSuggestions));
      }
    }
    setLoading(false);
  }

  React.useEffect(() => {
    if (value) {
      setValueAsTextFieldValue();
    }
  }, []);

  React.useEffect(() => {
    loadOptions(debouncedQuery);
  }, [debouncedQuery]);

  React.useEffect(() => {
    if (value) {
      if (valueProp) {
        setValueAsTextFieldValue();
      } else {
        setTextFieldValue(textProp(value));
      }
    } else {
      setTextFieldValue("");
    }
    setIsFocused(false);
  }, [value]);

  React.useEffect(() => {
    if (!isFocused) {
      if (value) {
        if (valueProp) {
          setValueAsTextFieldValue();
        } else {
          setTextFieldValue(textProp(value));
        }
      }
    }
  }, [isFocused]);

  return (
    <div onKeyDown={isFocused ? handleKeyDown : undefined}>
      <TextField
        ref={textFieldRef}
        InputProps={{
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={18} />
            </InputAdornment>
          ) : (
            undefined
          )
        }}
        style={{ minWidth: "500px" }}
        {...others}
        onFocus={e => {
          setIsFocused(true);
          onLoadOptions(textFieldValue);
        }}
        onBlur={(e: any) => {
          if (suggestions) {
            onOptionSelected(valueProp(suggestions[highlightedOption]));
          }

          setIsFocused(false);
        }}
        onChange={e => {
          setIsFocused(true);
          setTextFieldValue(e.target.value);
          onLoadOptions(e.target.value);
        }}
        value={textFieldValue || ""}
      />
      {isFocused && (
        <Popper
          open={isFocused}
          anchorEl={textFieldRef.current}
          placement="bottom-start"
          style={{ zIndex: 1000000 }}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={10}>
              <OptionList
                loading={loading}
                suggestions={suggestions}
                highlightedOption={highlightedOption}
                setHighlightedOption={setHighlightedOption}
                onOptionSelected={onOptionSelected}
                renderOption={element =>
                  renderOption ? (
                    renderOption(element, textFieldValue)
                  ) : (
                    <Typography>
                      {HighlightQuery(textProp(element), textFieldValue)}
                    </Typography>
                  )
                }
                renderNoOptionsFound={renderNoOptionsFound}
                maxOptions={maxShownOptions}
                maxHeight={maxHeightOptionsList}
                valueProp={valueProp}
              />
            </Fade>
          )}
        </Popper>
      )}
    </div>
  );
}

Autocomplete.defaultProps = {
  onOptionSelected: (value: any) => {
    window.alert(value);
  },
  textProp: (option: any) => (option.value ? option.value : option.toString()),
  valueProp: (option: any) => (option.id ? option.id : option),
  maxShownOptions: 10,
  maxHeightOptionsList: 500,
  renderNoOptionsFound: () => <Typography>No matches found!</Typography>
};

interface IOptionListProps {
  loading: boolean;
  suggestions?: any[];
  maxOptions: number | undefined;

  onOptionSelected: (e: any) => void;

  highlightedOption: number;
  setHighlightedOption: (value: number) => any;
  renderOption: (element: any) => React.ReactNode;
  renderNoOptionsFound: () => React.ReactNode;
  maxHeight: number;
  valueProp: (option: any) => string | number | any;
}

function OptionList(props: IOptionListProps) {
  React.useEffect(() => {
    const selectedLi = document.getElementById(
      "react-autocomplete-mui-selected-option"
    );
    if (selectedLi) {
      setTimeout(
        () =>
          selectedLi.scrollIntoView({ block: "center", behavior: "smooth" }),
        5
      );
    }
  }, [props.highlightedOption]);

  return (
    <Paper elevation={6}>
      {props.suggestions && props.suggestions.length > 0 ? (
        <List
          style={{
            minWidth: 250,
            maxHeight: props.maxHeight || 500,
            overflow: "auto"
          }}
        >
          {props.suggestions
            .slice(0, props.maxOptions)
            .map((element: any, index: number) => (
              <OptionItem
                key={index}
                index={index}
                element={element}
                onOptionSelected={props.onOptionSelected}
                renderOption={props.renderOption}
                highlightedOption={props.highlightedOption}
                setHighlightedOption={props.setHighlightedOption}
                valueProp={props.valueProp}
              />
            ))}
        </List>
      ) : (
        !props.loading && (
          <ListItem key={"noMatch"} button>
            {props.renderNoOptionsFound()}
          </ListItem>
        )
      )}
    </Paper>
  );
}

interface IOptionItemProps {
  index: number;
  element: any;
  onOptionSelected: (value: any) => void;
  highlightedOption: number;
  setHighlightedOption: (value: number) => void;
  renderOption: (element: any) => React.ReactNode;
  valueProp: (option: any) => string | number | any;
}

function OptionItem(props: IOptionItemProps) {
  return React.useMemo(() => {
    return (
      <ListItem
        selected={props.index === props.highlightedOption}
        id={
          props.index === props.highlightedOption
            ? "react-autocomplete-mui-selected-option"
            : undefined
        }
        key={props.index}
        button
        onMouseDown={() => {
          props.setHighlightedOption(props.index);
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
          props.onOptionSelected(props.valueProp(props.element));
        }}
      >
        {props.renderOption(props.element)}
      </ListItem>
    );
  }, [props.highlightedOption, props.renderOption]);
}

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

export interface IAutocompleteBaseProps {
  onOptionSelected?: (value: any) => void;
  onLoadOptions: (query: string) => Promise<any[]>;
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
  // const [maxOptions, setMaxOptions] = React.useState<
  //   number | undefined
  // >(maxShownOptions == -1 ? undefined : maxShownOptions);

  const textFieldRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case 40: //down arrow
        e.stopPropagation();
        if (
          (suggestions != null &&
            suggestions.length <= highlightedOption + 1) ||
          (maxShownOptions && maxShownOptions <= highlightedOption + 1)
        )
          setHighlightedOption(0);
        else setHighlightedOption(highlightedOption + 1);
        break;
      case 38: //up arrow
        e.stopPropagation();
        if (highlightedOption == 0) {
          if (maxShownOptions) setHighlightedOption(maxShownOptions - 1);
          else if (suggestions) setHighlightedOption(suggestions.length - 1);
        } else setHighlightedOption(highlightedOption - 1);
        break;
      case 13: //enter
      case 9: //tab
        e.stopPropagation();
        e.preventDefault();
        if (suggestions) {
          var element = suggestions[highlightedOption];
          onOptionSelected(valueProp(element));
        }
        textFieldRef.current && textFieldRef.current.blur();
        setIsFocused(false);
        break;
      case 27: // esc
        e.stopPropagation();
        textFieldRef.current != null && textFieldRef.current.blur();
        setIsFocused(false);
        break;
    }
  }
  /////Z
  ///Z
  //Z
  //Z
  //////////////////////WWWWWWWWWWWWEEEEEELLLLLLWWWWWOOOORRRRRKKKKIIIIINNNGGGGGG   VVVEEERRRSSSSIIIOOOONNNNNN

  const [timer, setTimer] = React.useState();

  React.useEffect(() => {
    if (isFocused) {
      setLoading(true);
      timer && clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          onLoadOptions(textFieldValue || "").then(
            result => {
              setSuggestions(result);
              setHighlightedOption(0);
              setLoading(false);
            },
            error => {
              // setErrorLoadingOptions(error);
              setLoading(false);
            }
          );
          timer && clearTimeout(timer);
        }, 500)
      );
    }
  }, [textFieldValue, isFocused]);

  React.useEffect(() => {
    if (value)
      if (valueProp) {
        suggestions &&
          setTextFieldValue(textProp(suggestions[highlightedOption]));
      } else {
        setTextFieldValue(textProp(value));
      }
    else setTextFieldValue("");
    setIsFocused(false);
  }, [value]);

  React.useEffect(() => {
    if (!isFocused) {
      if (value)
        if (valueProp) {
          suggestions &&
            setTextFieldValue(textProp(suggestions[highlightedOption]));
        } else {
          setTextFieldValue(textProp(value));
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
              <CircularProgress size={18}></CircularProgress>
            </InputAdornment>
          ) : (
            undefined
          )
        }}
        style={{ minWidth: "500px" }}
        {...others}
        onFocus={e => {
          setIsFocused(true);
          // others.onFocus && others.onFocus(e);
        }}
        onBlur={(e: any) => {
          // if (highlightedOption == null) setHighlightedOption(0);
          suggestions &&
            onOptionSelected(valueProp(suggestions[highlightedOption]));
          // setSuggestions([]);
          // setHighlightedOption(0);
          setIsFocused(false);
          // others.onBlur && others.onBlur(e);
        }}
        onChange={e => {
          setIsFocused(true);
          setTextFieldValue(e.target.value);
          // others.onChange && others.onChange(e);
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
                // setMaxOptions={setMaxOptions}
                maxHeight={maxHeightOptionsList}
                valueProp={valueProp}
                // showAllOption={showAllOption}
              />
            </Fade>
          )}
        </Popper>
      )}
    </div>
  );
}

Autocomplete.defaultProps = {
  onOptionSelected: (value: any) => {},
  textProp: (option: any) => option.toString(),
  valueProp: (option: any) => option,
  maxShownOptions: 10,
  maxHeightOptionsList: 500,
  renderNoOptionsFound: () => <Typography>No matches found!</Typography>
  // renderOption: (e: any, query: string) => (
  //   <Typography>{HighlightQuery(e.toString(), query)}</Typography>
  // )
  // showAllOption: "Alle Anzeigen"
};

interface IOptionListProps {
  loading: boolean;
  suggestions?: any[];
  maxOptions: number | undefined;
  // setMaxOptions: (n: number | undefined) => void;
  onOptionSelected: (e: any) => void;
  // showAllOption: () => React.ReactNode | string | undefined;
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
    selectedLi &&
      setTimeout(
        () =>
          selectedLi.scrollIntoView({ block: "center", behavior: "smooth" }),
        5
      );
  }, [props.highlightedOption]);

  // function getShowAllOption() {
  //   if (typeof props.showAllOption == "string") {
  //     return <Typography>{props.showAllOption}</Typography>;
  //   } else if (props.showAllOption != undefined) {
  //     return props.showAllOption;
  //   } else {
  //     return <Typography>Show All</Typography>;
  //   }
  // }

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
          {/* {props.showAllOption &&
            props.maxOptions != undefined &&
            props.suggestions &&
            props.suggestions.length > props.maxOptions && (
              <ListItem
                key="showAllOption"
                button
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  e.stopPropagation();
                  props.setMaxOptions(undefined);
                }}
              >
                {getShowAllOption()}
              </ListItem>
            )} */}
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

interface OptionItemProps {
  index: number;
  element: any;
  onOptionSelected: (value: any) => void;
  highlightedOption: number;
  setHighlightedOption: (value: number) => void;
  renderOption: (element: any) => React.ReactNode;
  valueProp: (option: any) => string | number | any;
}

function OptionItem(props: OptionItemProps) {
  return React.useMemo(() => {
    return (
      <ListItem
        selected={props.index == props.highlightedOption}
        id={
          props.index == props.highlightedOption
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

export function HighlightQuery(
  text: string,
  query: string,
  style: React.CSSProperties = { fontWeight: "bold" }
) {
  if (query == null || query.length == 0) return text;

  var startingIndex = text.toLowerCase().indexOf(query.toLowerCase(), 0);

  return startingIndex > -1 ? (
    <span>
      {text.substring(0, startingIndex)}
      <span style={style}>
        {text.substring(startingIndex, startingIndex + query.length)}
      </span>
      {text.substring(startingIndex + query.length)}
    </span>
  ) : (
    text
  );
}

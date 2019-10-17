import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Paper, Divider, Typography } from "@material-ui/core";
import { HighlightQuery } from "@dccs/utils";
import { countries, keyValueList } from "./data";
import { Autocomplete } from "../src/Autocomplete";

const api = {
  queryCountries: (query: string) =>
    countries.filter(c => c.name.includes(query) || c.region.includes(query)),
  queryKeyValue: (query: string) =>
    new Promise<any[]>((res, rej) =>
      setTimeout(
        () =>
          res(
            keyValueList.filter(c =>
              c.value.toLocaleLowerCase().includes(query.toLowerCase())
            )
          ),
        1000
      )
    )
};

function CountryAutocomplete() {
  const [value, setValue] = React.useState();

  return (
    <Autocomplete
      label="Länder"
      value={value}
      onOptionSelected={(object: any) => setValue(object)}
      onLoadOptions={(q: string) => api.queryCountries(q)}
      textProp={option => option.name}
    />
  );
}

function CountryAutocompleteWithInitalValue() {
  const [value, setValue] = React.useState("Austria");

  return (
    <Autocomplete
      label="Länder"
      value={value}
      onOptionSelected={(object: any) => setValue(object)}
      onLoadOptions={(q: string) => api.queryCountries(q)}
      textProp={option => option.name}
      valueProp={option => option.name}
    />
  );
}

function CountryAutocompleteValueProp() {
  const [value, setValue] = React.useState();

  return (
    <Autocomplete
      label="Länder"
      value={value}
      onOptionSelected={(object: any) => {
        setValue(object);
        window.alert(object);
      }}
      onLoadOptions={(q: string) => api.queryCountries(q)}
      textProp={option => option.name}
      valueProp={option => option.region}
    />
  );
}

function CountryAutocompleteCustomRenderFunction() {
  const [value, setValue] = React.useState();

  return (
    <Autocomplete
      label="Länder"
      value={value}
      onOptionSelected={(object: any) => setValue(object)}
      onLoadOptions={(q: string) => api.queryCountries(q)}
      textProp={option => option.name}
      renderOption={(element, query) => (
        <div>
          <Typography>{HighlightQuery(element.name, query)}</Typography>
          <Typography>
            {HighlightQuery(element.region, query, {
              color: "pink",
              backgroundColor: "green"
            })}
          </Typography>
        </div>
      )}
    />
  );
}

function KeyVlaueAutocomplete() {
  const [value, setValue] = React.useState();

  return (
    <Autocomplete
      label="Key Value Example"
      value={value}
      onOptionSelected={(object: any) => setValue(object)}
      onLoadOptions={(q: string) => api.queryKeyValue(q)}
    />
  );
}

storiesOf("Autocomplete", module).add("Autocomplete", () => (
  <Paper style={{ minWidth: "600px", minHeight: "600px", padding: "10px" }}>
    <Typography>
      Autocomplete example with "Key Value" list as options
    </Typography>
    <KeyVlaueAutocomplete />
    <Divider style={{ margin: "20px" }} />
    <Typography>
      Autocomplete example with list of complex objects as options using
      textProp
    </Typography>
    <CountryAutocomplete />
    <Divider style={{ margin: "20px" }} />
    <Typography>
      Autocomplete example with list of complex objects as options using
      textProp and a custom render-function
    </Typography>
    <CountryAutocompleteCustomRenderFunction />
    <Divider style={{ margin: "20px" }} />
    <Typography>
      Autocomplete example with list of complex objects as options using
      textProp and valueProp
    </Typography>
    <CountryAutocompleteValueProp />
    <Divider style={{ margin: "20px" }} />
    <Typography>
      Autocomplete example with list of complex objects as options using
      textProp and valueProp with an initialValue
    </Typography>
    <CountryAutocompleteWithInitalValue />
  </Paper>
));

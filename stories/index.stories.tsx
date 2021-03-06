import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Paper, Typography } from "@material-ui/core";
import { countries, keyValueList } from "./data";
import { Autocomplete } from "../src/Autocomplete";

const api = {
  queryCountries: (query: string) =>
    new Promise<any[]>((res, rej) =>
      setTimeout(
        () =>
          res(
            countries.filter(
              (c) => c.name.includes(query) || c.region.includes(query)
            )
          ),

        1000
      )
    ),
  queryKeyValue: (query: string) =>
    new Promise<any[]>((res, rej) =>
      setTimeout(
        () =>
          res(
            keyValueList.filter((c) =>
              c.value.toLocaleLowerCase().includes(query.toLowerCase())
            )
          ),
        1000
      )
    ),
  getValueForKey: (key: any) =>
    new Promise<any>((res, rej) =>
      setTimeout(() => res(keyValueList.find((c) => c.id === key)), 1000)
    ),
};

function DefaultAutocomplete() {
  const [value, setValue] = React.useState("Austria");

  return (
    <React.Fragment>
      <Autocomplete<any>
        value={value}
        options={countries}
        onChange={(_, nValue) => setValue(nValue)}
        keyProp={(o) => o.name}
        textProp={(o) => o.name}
        // disableClearable={true}
        highlightQuery={true}
        textFieldProps={{ style: { minWidth: "240px" } }}
      />
      <Typography variant="caption">current value: {value}</Typography>
      <br />
      <button onClick={() => setValue("")}>Set empty</button>
    </React.Fragment>
  );
}

function AsyncAutocomplete() {
  const [value, setValue] = React.useState("AT");

  return (
    <React.Fragment>
      <Autocomplete<any>
        value={value}
        textFieldProps={{
          label: "Async",
          style: { minWidth: "240px" },
        }}
        variant="async"
        onLoadOptions={(query) => api.queryCountries(query)}
        keyToOption={(key) =>
          new Promise<any>((res, rej) => {
            setTimeout(() => {
              res(countries.find((c) => c.alpha2Code === key));
            }, 1000);
          })
        }
        onChange={(_, nValue) => setValue(nValue)}
        keyProp={(o) => o.alpha2Code}
        textProp={(o) => o.name}
        // disableClearable={true}
        highlightQuery={true}
        loadingText={"asdf"}
      />
      <Typography variant="caption">
        current value (country code): {value}
      </Typography>
      <br />
      <button onClick={() => setValue("")}>Set empty</button>
    </React.Fragment>
  );
}

storiesOf("Autocomplete", module).add("Autocomplete", () => (
  <Paper style={{ minWidth: "600px", minHeight: "600px", padding: "10px" }}>
    <DefaultAutocomplete />
    <div style={{ height: "16px" }} />
    <AsyncAutocomplete />
  </Paper>
));

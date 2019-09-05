import * as React from "react";

import { storiesOf } from "@storybook/react";

import urljoin from "url-join";
import { Autocomplete, HighlightQuery } from "../src/Autocomplete";
import { FormikAutocompleteField } from "../src/FormikAutocomplete";
import { Typography, Paper, Divider, Button } from "@material-ui/core";
import { Formik, FormikProps } from "formik";

function apiUrl(relative: string) {
  return urljoin("http://localhost:5000/", relative);
}

function getJSON(url: string) {
  return fetch(url, { credentials: "include" }).then(r => r.json());
}

const path = "/countries";
const api = {
  query: (q: string) => getJSON(apiUrl(`${path}?q=${q}`)),
  queryName: (q: string) => getJSON(apiUrl(`${path}?name_like=${q}`)),
  queryRegion: (q: string) => getJSON(apiUrl(`${path}?region_like=${q}`))
};

function DummyAutocomplete() {
  const [value, setValue] = React.useState();

  return (
    <Autocomplete
      label="Länder"
      value={value}
      textProp={(value: any) => value.name}
      onOptionSelected={(value: any) => setValue(value)}
      onLoadOptions={(q: string) => api.query(q)}
      renderOption={(value: any, query: string) => (
        <div>
          <Typography>{HighlightQuery(value.name, query)}</Typography>
          <Typography>{HighlightQuery(value.region, query)}</Typography>
        </div>
      )}
    ></Autocomplete>
  );
}

storiesOf("Autocomplete", module).add("Autocomplete", () => (
  <Paper style={{ minWidth: "600px", minHeight: "600px", padding: "10px" }}>
    <Formik
      initialValues={{
        country: ""
      }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        });
      }}
      render={(formikProps: FormikProps<any>) => (
        <form onSubmit={formikProps.handleSubmit} autoComplete="off">
          <FormikAutocompleteField
            name="country"
            label="Länder"
            onLoadOptions={(q: string) => api.query(q)}
            textProp={(value: any) => value.name}
            valueProp={(value:any)=>value.name}
          ></FormikAutocompleteField>
          <Button type="submit">Save</Button>
          <Button onClick={formikProps.handleReset}>Reset</Button>
        </form>
      )}
    />
    <Divider style={{ margin: "20px" }}></Divider>
    <DummyAutocomplete />
  </Paper>
));

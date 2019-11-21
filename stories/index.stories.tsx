import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Paper, Divider, Typography, Button } from "@material-ui/core";
import { HighlightQuery } from "@dccs/utils";
import { countries, keyValueList } from "./data";
import { Autocomplete } from "../src/Autocomplete";
import { RenderOptionState } from "@material-ui/lab/Autocomplete";

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
    ),
  getValueForKey: (key: any) =>
    new Promise<any>((res, rej) =>
      setTimeout(() => res(keyValueList.find(c => c.id === key)), 1000)
    )
};

// function CountryAutocomplete() {
//   const [value, setValue] = React.useState();

//   return (
//     <Autocomplete
//       label="Länder"
//       value={value}
//       onOptionSelected={(object: any) => setValue(object)}
//       onLoadOptions={(q: string) => api.queryCountries(q)}
//       textProp={option => option.name}
//     />
//   );
// }

// function CountryAutocompleteWithInitalValue() {
//   const [value, setValue] = React.useState("AUT");

//   return (
//     <div>
//       <Autocomplete
//         label="Länder"
//         value={value}
//         onOptionSelected={(object: any) => setValue(object)}
//         onLoadOptions={(q: string) => api.queryCountries(q)}
//         textProp={option => option.name}
//         valueProp={option => option.alpha3Code}
//       />
//       <Button
//         onClick={() => {
//           setValue("AUT");
//         }}
//       >
//         <Typography>Reset</Typography>
//       </Button>
//     </div>
//   );
// }

// function CountryAutocompleteValueProp() {
//   const [value, setValue] = React.useState();

//   return (
//     <div style={{ display: "flex", flexDirection: "column", width: "500px" }}>
//       <Typography variant="body1">{value || "undefiend"}</Typography>
//       <Typography variant="caption">Value</Typography>
//       <Autocomplete
//         label="Länder"
//         value={value}
//         onOptionSelected={(object: any) => {
//           setValue(object);
//         }}
//         onLoadOptions={(q: string) => api.queryCountries(q)}
//         textProp={option => option.name}
//         valueProp={option => option.alpha3Code}
//       />
//     </div>
//   );
// }

// function CountryAutocompleteCustomRenderFunction() {
//   const [value, setValue] = React.useState();

//   return (
//     <Autocomplete
//       label="Länder"
//       value={value}
//       onOptionSelected={(object: any) => setValue(object)}
//       onLoadOptions={(q: string) => api.queryCountries(q)}
//       textProp={option => option.name}
//       renderOption={(option: any, state: RenderOptionState) => (
//         <div>
//           <Typography>
//             {HighlightQuery(option.name, state.inputValue)}
//           </Typography>
//           <Typography>
//             {HighlightQuery(option.region, state.inputValue, {
//               color: "pink",
//               backgroundColor: "green"
//             })}
//           </Typography>
//         </div>
//       )}
//     />
//   );
// }

// function KeyVlaueAutocomplete() {
//   const [value, setValue] = React.useState(1);

//   return (
//     <Autocomplete
//       label="Key Value Example"
//       value={value}
//       valueProp={value => value.id}
//       textProp={value => value.value}
//       valueToOption={value => {
//         api.getValueForKey(value);
//       }}
//       // onOptionSelected={(object: any) => setValue(object)}
//       onChange={(e, value) => setValue(value)}
//       onLoadOptions={(q: string) => api.queryKeyValue(q)}
//     />
//   );
// }

function DefaultAutocomplete() {
  const [value, setValue] = React.useState("Austria");

  return (
    <Autocomplete<any>
      value={value}
      options={countries}
      onChange={(e, value) => setValue(value)}
      keyProp={o => o.name}
      textProp={o => o.name}
      disableClearable={true}
      highlightQuery={true}
    />
  );
}

storiesOf("Autocomplete", module).add("Autocomplete", () => (
  <Paper style={{ minWidth: "600px", minHeight: "600px", padding: "10px" }}>
    <DefaultAutocomplete />
    <Divider style={{ margin: "20px" }} />
    {/* <Typography>
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
    <CountryAutocompleteWithInitalValue /> */}
  </Paper>
));

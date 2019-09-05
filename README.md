# react-autocomplete-mui &middot; ![travis build](https://img.shields.io/travis/DCCS-IT-Business-Solutions/react-autocomplete-mui.svg) ![npm version](https://img.shields.io/npm/v/@dccs/react-autocomplete-mui.svg)

Simple Formik <-> MaterialUI wrappers. [https://dccs-it-business-solutions.github.io/react-autocomplete-mui/](https://dccs-it-business-solutions.github.io/react-autocomplete-mui/)

## Installation

You should install [react-autocomplete-mui with npm or yarn](https://www.npmjs.com/package/@dccs/react-autocomplete-mui):

    npm install @dccs/react-autocomplete-mui
    or
    yarn add @dccs/react-autocomplete-mui

This command will download and install react-autocomplete-mui

## How it works

Example for Autcomplete with a list of as options
**textProp** uses `object.value` or `object.toString()` (if there is no property _value_) per default
**valueProp** uses `object.id` or `object` (if there is no property _id_) per default

```javascript
<Autocomplete
  label="Key Value Example"
  value={value}
  onOptionSelected={(object: any) => /*Do something with the id*/}
  onLoadOptions={(q: string) => /*return the filtered list of options*/ }
/>
```

Example for Autocomplete with a list of complex objects

```javascript
<Autocomplete
  label="Länder"
  value={value}
  onOptionSelected={(object: any) => /*Do something with the id*/}
  onLoadOptions={(q: string) => /*return the filtered list of options*/ }
  textProp={option => option.name}
/>
```

Example for Autocomplete with a list of complex objects and a custom `renderOption` function

```javascript
<Autocomplete
  label="Länder"
  value={value}
  onOptionSelected={(object: any) => /*Do something with the id*/}
  onLoadOptions={(q: string) => /*return the filtered list of options*/ }
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
```

## Contributing

### License

@dccs/react-autocomplete-mui is [MIT licensed](https://github.com/facebook/react/blob/master/LICENSE)

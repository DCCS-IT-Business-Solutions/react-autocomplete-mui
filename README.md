# react-autocomplete-mui &middot; ![travis build](https://img.shields.io/travis/DCCS-IT-Business-Solutions/react-autocomplete-mui.svg) ![npm version](https://img.shields.io/npm/v/@dccs/react-autocomplete-mui.svg)

Simple Autocomplete using Material-UI

## Demos

[https://dccs-it-business-solutions.github.io/react-autocomplete-mui/](https://dccs-it-business-solutions.github.io/react-autocomplete-mui/)

## Installation

You should install [react-autocomplete-mui with npm or yarn](https://www.npmjs.com/package/@dccs/react-autocomplete-mui):

    npm install @dccs/react-autocomplete-mui
    or
    yarn add @dccs/react-autocomplete-mui

This command will download and install react-autocomplete-mui

## How it works

This package is based on the [@material-ui/lab/Autocomplete](https://material-ui.com/components/autocomplete/)

Uncontrolled Autocomplete with static options

```javascript
   <Autocomplete<any>
      options={[{id:1, name:"Test 1"}, {id:2, name:"Test 2"}]}
      keyProp={o => o.id}
      textProp={o => o.name}
    />
/>
```

Controlled Autocomplete with options loaded async

```javascript
<Autocomplete
  variant="async"
  onLoadOptions={query => api.queryCountries(query)}
  keyToOption={key => api.getCountry(key)}
  keyProp={o => o.name}
  textProp={o => o.name}
/>
```

## Contributing

### License

@dccs/react-autocomplete-mui is [MIT licensed](https://github.com/facebook/react/blob/master/LICENSE)

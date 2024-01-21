# mittleware

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Piping hot middleware

## Install

Download the [CJS](https://github.com/ryanmorr/mittleware/raw/master/dist/cjs/mittleware.js), [ESM](https://github.com/ryanmorr/mittleware/raw/master/dist/esm/mittleware.js), [UMD](https://github.com/ryanmorr/mittleware/raw/master/dist/umd/mittleware.js) versions or install via NPM:

``` sh
npm install @ryanmorr/mittleware
```

## Usage

Add middleware for sequentially and asynchronously processing data. Each piece of middleware is responsible for passing the data to the next one. Optionally, middleware can resolve or reject the process immediately if it is finished or encounters an error:

``` javascript
import mittleware from '@ryanmorr/mittleware';

// Create a processor
const mw = mittleware();

// Add middleware
mw.use((data, next) => {
    // Manipulate the data
    data.baz = 3;
    // Then pass it off to the next piece of middleware
    next(data);
});

// Add more middleware
mw.use((data, next, resolve, reject) => {
    // Validate the data
    if (isInvalid(data)) {
        // Abort if errors are found
        reject(new Error('Invalid parameters'));
    }
    // Immediately fulfill the promise and skip the remaining middleware
    resolve(data);
});

// Dispatch data to the middleware and return a promise
mw.dispatch({foo: 1, bar: 2}).then((data) => {
    console.log(data); //=> {foo: 1, bar: 2, baz: 3}
}).catch((error) => {
    console.error(error); //=> "Error: Invalid parameters"
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/mittleware
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/mittleware?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/mittleware/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/mittleware/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/mittleware?color=blue&style=flat-square
[license-url]: UNLICENSE

# mittleware

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> Piping hot middleware

## Install

Download the [development](http://github.com/ryanmorr/mittleware/raw/master/dist/mittleware.js) or [minified](http://github.com/ryanmorr/mittleware/raw/master/dist/mittleware.min.js) version, or install via NPM:

``` sh
npm install @ryanmorr/mittleware
```

## Usage

Add middleware for sequentially and asynchronously processing data. Each piece of middleware is responsible for passing the data to the next one. Optionally, middleware can resolve or reject the process immediately if it is finished or encounters an error:

``` javascript
const mw = mittleware();

mw.use((data, next) => {
    data.baz = 3;
    next(data);
});

mw.use((data. next. resolve, reject) => {
    if (isInvalid(data)) {
        reject(new Error('Invalid parameters'));
    }
    resolve(data);
});

mw.dispatch({foo: 1, bar: 2}).then((data) => {
    console.log(data); //=> {foo: 1, bar: 2, baz: 3}
}).catch((error) => {
    console.error(error); //=> "Error: Invalid parameters"
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/mittleware
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fmittleware.svg
[build-url]: https://travis-ci.org/ryanmorr/mittleware
[build-image]: https://travis-ci.org/ryanmorr/mittleware.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
<div align="center">
<h1>resulti</h1>

<p>A Rustism meant to make error handling much less error prone and more mandatory</p>

</div>

## The problem

The fact that error handling in JavaScript is an afterthought with infinite variations of how it should be properly dealt with like `try {} catch(e) {}`, `.catch()`, `.on("error", fn)`, and many more.

## The solution

A Rustism (an idea/solution coming from [Rust Lang](https://www.rust-lang.org/)) which does exactly that. It encodes a variable in a Result type that can be either the actual variable or an error.</br>
By returning a `resulti` from the function that might error in your library you give people a straightforward methodology of dealing with errors of any type.

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org) and should be installed as one of your project's `dependencies`:

```
npm install --save resulti
```

## Usage

You can use it anywhere to encode a value that could potentially be an error.

Example:

```js
import { ok, err } from "resulti";
// or
const { ok, err } = require("resulti");

const resultiWithOk = ok("myVal");
const resultiWithErr = err(Error("myError"));
```

A common place could be in interloping with normal async functions (if you're writing a library with an async function and using `resulti` you should always resolve to a `resulti`)

```js
import { ok, err } from "resulti";
// or
const { ok, err } = require("resulti");

async function example() {
  const couldBeError = await doSomethingAsync.then(ok).catch(err);
  if (couldBeError.isOk()) {
    const val = couldBeError.unwrap(); // Unwarp value from resulti
    // Handle concrete val
  } else {
    const val = couldBeError.unwrapErr(); // Unwrap error value to handle it as appropriate
    // Handle concrete error
  }
}
```

The above pattern is rather common that `resulti` offers a way to simplify it

```js
import { resultify } from "resulti";
// or
const { resultify } = require("resulti");

async function example() {
  const couldBeError = await resultify(doSomethingAsync);
  // ...
}
```

## Docs

`ok(val)`, a function for creating a `resulti` ok variant. Equivalent to `resulti(val)`

`err(val)`, a function for creating a `resulti` error variant. Equivalent to `resulti(undefined, val)`

---

`resulti`, a function for creating `resulti`s. Has few methods built on it for convenience:

`resulti(okVariant, errVariant)`:

- `resulti.isOk()`: Returns true if `resulti` has an ok variant otherwise false.

- `resulti.isErr()`: Returns true if `resulti` has an error variant otherwise false.
- `resulti.unwrap()`: Returns the value of `resulti`'s ok variant. Otherwise throws.
- `resulti.unwrapErr()`: Returns the value of `resulti`'s error variant. Otherwise throws.
- `resulti.unwrapOr(defaultValue)`: Returns `resulti`'s ok variant if it exists otherwise `defaultValue` passed to it.
- `resulti.unwrapOrElse(fn)`: Returns `resulti`'s ok variant if it exists or the return value of calling `fn` with the error variant.
- `resulti.expect(errMsg)`: Returns the value of `resulti`'s ok variant. Otherwise throws errMsg.
- `resulti.expectErr(errMsg)`: Returns the value of `resulti`'s error variant. Otherwise throws `errMsg`.
- `resulti.map(fn)`: maps the ok variant of a `resulti`. Does nothing if ok variant doesn't exist.
- `resulti.mapErr(fn)`: maps the error variant of a `resulti`. Does nothing if error variant doesn't exist.
- `resulti.mapOrElse(fn1, fn2)`: maps the ok variant of a `resulti` with `fn1`. Otherwise maps the error variant with `fn2`.
- `resulti.and(val)`: Returns `val` if ok variant exists otherwise returns the `resulti` itself.
- `resulti.andThen(fn)`: Returns the return value of calling `fn` with ok variant if it exists, otherwise returns the `resulti` itself.
- `resulti.or(val)`: Returns `val` if error variant exists otherwise returns the `resulti` itself.
- `resulti.orElse(fn)`: Returns the return value of calling `fn` with ok variant if it exists, otherwise returns the `resulti` itself.

---

`resultify`: a utility for turning promises into promises that ALWAYS resolve into a `resulti`:

`resultify(promise, mapOk, mapErr)`: Both mapOk and mapErr are optional and need to be functions if provided. They simply map the resulti in both its variants.

---

`isResulti(val)`: is a utility function to determine if a `val` is a `resulti` or not.

## License

MIT

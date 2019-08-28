const Resulti = Symbol("resulti");

export function resulti(T, E) {
  const isOk = T !== undefined;
  const isErr = E !== undefined;

  if (isOk && isErr)
    throw Error(
      `Invariant fail: Attempting to pass both a type and an error is invalid usage of resulti: resulti(${T}, ${E})`
    );
  if (!isOk && !isErr)
    throw Error(
      `Invariant fail: resulti requires one of the two variants to be passed: resulti(${T}, ${E})`
    );

  return Object.freeze({
    isOk: () => isOk,
    isErr: () => isErr,
    unwrap: () => {
      if (isErr) throw E;
      return T;
    },
    unwrapErr: () => {
      if (isOk) throw Error(T);
      return E;
    },
    unwrapOr: optb => (isErr ? optb : T),
    unwrapOrElse: op => (isErr ? op(E) : T),
    expect: error => {
      if (isErr) throw error;
      return T;
    },
    expectErr: error => {
      if (isOk) throw error;
      return E;
    },
    map(f) {
      return isOk ? resulti(f(T), E) : this;
    },
    mapErr(m) {
      return isErr ? resulti(T, m(E)) : this;
    },
    mapOrElse(f, m) {
      return this.map(f).mapErr(m);
    },
    and(res) {
      return isOk ? res : this;
    },
    andThen(op) {
      return isOk ? op(T) : E;
    },
    or(res) {
      return isErr ? res : this;
    },
    orElse(op) {
      return isErr ? op(E) : T;
    },
    rslti: Resulti,
  });
}

const i = x => x;

export const resultify = (promise, okMap = i, errMap = i) => {
  return promise
    .then(x => resulti(x).map(okMap))
    .catch(x => resulti(undefined, x).mapErr(errMap));
};

export function isResulti(res = {}) {
  return res.rslti === Resulti;
}

export function ok(val) {
  return resulti(val);
}

export function err(val) {
  return resulti(undefined, val);
}

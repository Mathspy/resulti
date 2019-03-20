const Resulti = Symbol("resulti");

export function resulti(T, E) {
  const isOk = T != undefined
  const isErr = E != undefined

  if (isOk && isErr) throw Error(`Invariant fail: Attempting to pass both a type and an error is invalid usage of resulti: resulti(${T}, ${E})`);
  if (!isOk && !isErr) throw Error(`Invariant fail: resulti requires one of the two variants to be non-nully: resulti(${T}, ${E})`);

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
    unwrapOr: (optb) => isErr ? optb : T,
    unwrapOrElse: (op) => isErr ? op(E) : T,
    expect: (err) => {
      if (isErr) throw err;
      return T;
    },
    expectErr: (err) => {
      if (isOk) throw err;
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
    rslti: Resulti
  });
}

const i = x => x;

export const resultify = (promise, ok = i, err = i) => {
  return promise.then(x => resulti(x).map(ok)).catch(x => resulti(null, x).mapErr(err));
};

export function isResulti(res) {
  return res.rslti === Resulti;
}

import { resulti, isResulti, resultify } from "../src/index";

describe("resulti", () => {
  it("should throw if both variants are passed", () => {
    expect(() => resulti("type", "error")).toThrow();
    expect(() => resulti(0, 0)).toThrow();
    expect(() => resulti("", 0)).toThrow();
    expect(() => resulti(0, NaN)).toThrow();
    expect(() => resulti(NaN, "")).toThrow();
  })

  it("should throw if both variants null-y", () => {
    expect(() => resulti()).toThrow();
    expect(() => resulti(null, null)).toThrow();
    expect(() => resulti(null, undefined)).toThrow();
    expect(() => resulti(undefined, null)).toThrow();
    expect(() => resulti(undefined, undefined)).toThrow();
  })

  it("resulti's isOk should return true unless null or undefined", () => {
    expect(resulti(0).isOk()).toBe(true);
    expect(resulti("").isOk()).toBe(true);
    expect(resulti(NaN).isOk()).toBe(true);
    expect(resulti("test").isOk()).toBe(true);
    expect(resulti([]).isOk()).toBe(true);
    expect(resulti([1, 2, 3]).isOk()).toBe(true);
    expect(resulti({}).isOk()).toBe(true);
    expect(resulti({a: "b"}).isOk()).toBe(true);

    expect(resulti(null, 0).isOk()).toBe(false);
    expect(resulti(undefined, 0).isOk()).toBe(false);
  })

  it("resulti's isErr should return true unless null or undefined", () => {
    expect(resulti(null, 0).isErr()).toBe(true);
    expect(resulti(null, "").isErr()).toBe(true);
    expect(resulti(null, NaN).isErr()).toBe(true);
    expect(resulti(null, "test").isErr()).toBe(true);
    expect(resulti(null, []).isErr()).toBe(true);
    expect(resulti(null, [1, 2, 3]).isErr()).toBe(true);
    expect(resulti(null, {}).isErr()).toBe(true);
    expect(resulti(null, { a: "b" }).isErr()).toBe(true);

    expect(resulti(0, null).isErr()).toBe(false);
    expect(resulti(0, undefined).isErr()).toBe(false);
  })

  it("ok should just pass back T", () => {
    expect(resulti(0).unwrap()).toBe(0);
    expect(resulti("").unwrap()).toBe("");
    expect(resulti(NaN).unwrap()).toBe(NaN);
    expect(resulti("test").unwrap()).toBe("test");
    expect(resulti([]).unwrap()).toEqual([]);
    expect(resulti([1, 2, 3]).unwrap()).toEqual([1,2, 3]);
    expect(resulti({}).unwrap()).toEqual({});
    expect(resulti({ a: "b" }).unwrap()).toEqual({a: "b"});
  })

  it("err should just pass back E", () => {
    expect(resulti(null, 0).unwrapErr()).toBe(0);
    expect(resulti(null, "").unwrapErr()).toBe("");
    expect(resulti(null, NaN).unwrapErr()).toBe(NaN);
    expect(resulti(null, "test").unwrapErr()).toBe("test");
    expect(resulti(null, []).unwrapErr()).toEqual([]);
    expect(resulti(null, [1, 2, 3]).unwrapErr()).toEqual([1, 2, 3]);
    expect(resulti(null, {}).unwrapErr()).toEqual({});
    expect(resulti(null, { a: "b" }).unwrapErr()).toEqual({ a: "b" });
  })

  it("unwrap will return T, unless resulti is error then it will throw it", () => {
    expect(resulti("IsOk").unwrap()).toBe("IsOk");
    expect(() => resulti(null, "IsError").unwrap()).toThrow("IsError");
  })

  it("unwrapErr will return error, unless resulti is ok then it will throw T", () => {
    expect(() => resulti("IsOk").unwrapErr()).toThrow("IsOk");
    expect(resulti(null, "IsError").unwrapErr()).toEqual("IsError");
  })

  it("unwrapOr will return T, unless resulti is error then it will return whatever is passed to it", () => {
    expect(resulti("IsOk").unwrapOr("OtherValue")).toBe("IsOk");
    expect(resulti(null, "IsError").unwrapOr("OtherValue")).toBe("OtherValue");
  })

  it("unwrapOrElse will return T, unless resulti is error then it will call error with func passed to it", () => {
    expect(resulti("IsOk").unwrapOrElse(x => x.length)).toBe("IsOk");
    expect(resulti(null, "IsError").unwrapOrElse(x => x.length)).toBe("IsError".length);
  })

  it("expect will return T, unless resulti is error then it throw value passed to it", () => {
    expect(resulti("IsOk").expect("OtherValue")).toBe("IsOk");
    expect(() => resulti(null, "IsError").expect("OtherValue")).toThrow("OtherValue");
  })

  it("expect will return error, unless resulti is ok then it throw value passed to it", () => {
    expect(() => resulti("IsOk").expectErr("OtherValue")).toThrow("OtherValue");
    expect(resulti(null, "IsError").expectErr("OtherValue")).toBe("IsError");
  })

  it("map will return new resulti with T mapped with mapping function", () => {
    const mappedOk = resulti("IsOk", null).map(x => x.length);
    const mappedErr = resulti(null, "IsError").map(x => x.length);

    expect(mappedOk.unwrap()).toBe("IsOk".length);
    expect(mappedErr.unwrapErr()).toBe("IsError");
  })

  it("mapErr will return new resulti with error mapped with mapping function", () => {
    const mappedOk = resulti("IsOk", null).mapErr(x => x.length);
    const mappedErr = resulti(null, "IsError").mapErr(x => x.length);

    expect(mappedOk.unwrap()).toBe("IsOk");
    expect(mappedErr.unwrapErr()).toBe("IsError".length);
  })

  it("mapOrElse will return new resulti with T mapped with initial mapping func or error mapped with secondary func", () => {
    const mappedOk = resulti("IsOk", null).mapOrElse(x => x.length, x => x.split());
    const mappedErr = resulti(null, "IsError").mapOrElse(x => x.length, x => x.split(""));

    expect(mappedOk.unwrap()).toBe("IsOk".length);
    expect(mappedErr.unwrapErr()).toEqual(["I", "s", "E", "r", "r", "o" ,"r"]);
  })

  it("and will return passed value if resulti is ok otherwise will return resulti", () => {
    const val = resulti(null, "IsError");

    expect(resulti("IsOk").and("RandomValue")).toBe("RandomValue");
    expect(val.and("RandomValue")).toEqual(val);
  })

  it("andThen will perform operation on T or return E", () => {
    expect(resulti("IsOk").andThen(x => x.length)).toBe("IsOk".length);
    expect(resulti(null, "IsError").andThen(x => x.length)).toBe("IsError");
  })

  it("or will return passed value if resulti is error otherwise will return resulti", () => {
    const val = resulti("IsOk");

    expect(val.or("RandomValue")).toBe(val);
    expect(resulti(null, "IsError").or("RandomValue")).toEqual("RandomValue");
  })

  it("orElse will perform operation on E or return T", () => {
    expect(resulti("IsOk").orElse(x => x.length)).toBe("IsOk");
    expect(resulti(null, "IsError").orElse(x => x.length)).toBe("IsError".length);
  })

  it("will never mutate the effect below anyone's feet", () => {
    const ok = resulti("IsOk", null);
    const firstMappedOk = ok.map(x => x.length);
    const secondMappedOk = ok.map(x => x.split(""));

    expect(ok.unwrap()).toBe("IsOk");
    expect(firstMappedOk.unwrap()).toBe("IsOk".length);
    expect(secondMappedOk.unwrap()).toEqual(["I", "s" , "O" ,"k"]);
  })
})

describe("isResulti", () => {
  it("can tell if a value is a resulti or not", () => {
    expect(isResulti(resulti("IsOk"))).toBe(true);
    expect(isResulti(resulti(null, "IsError"))).toBe(true);

    expect(isResulti("IsOk")).toBe(false);
    expect(isResulti("IsError")).toBe(false);
    expect(isResulti(false)).toBe(false);
    expect(isResulti(NaN)).toBe(false);
    expect(isResulti(12345)).toBe(false);
  })

  it("a resulti will always be a resulti", () => {
    expect(() => {resulti("IsOk").rslti = null}).toThrow();
  })
})

describe("resultify", () => {
  it("can resultify a resolving promise", () => {
    const resultiedPromise = resultify(Promise.resolve("Test"));

    return resultiedPromise.then(resultied => {
      expect(resultied.isOk()).toBe(true);
      expect(resultied.unwrap()).toBe("Test");
    })
  })

  it("can resultify a rejecting promise", () => {
    const resultiedPromise = resultify(Promise.reject(Error("Fail")));

    return resultiedPromise.then(resultied => {
      expect(resultied.isErr()).toBe(true);
      expect(resultied.unwrapErr()).toEqual(Error("Fail"));
    })
  })

  it("allows mapping the promise if it resolves using the second argument", () => {
    const resultiedPromise = resultify(Promise.resolve("Test"), i => i.length);

    return resultiedPromise.then(resultied => {
      expect(resultied.isOk()).toBe(true);
      expect(resultied.unwrap()).toBe(4);
    })
  })

  it("allows mapping the promise if it rejects using the third argument", () => {
    const resultiedPromise = resultify(Promise.reject(Error("Fail")), i => i, i => i.message);

    return resultiedPromise.then(resultied => {
      expect(resultied.isErr()).toBe(true);
      expect(resultied.unwrapErr()).toBe("Fail");
    })
  })
})

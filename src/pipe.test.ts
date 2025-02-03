import assert from "node:assert";
import { describe, it } from "node:test";
import { pipe } from "./pipe";

describe("pipe()", () => {
  it("pipes results of first function to second with same types", async () => {
    const operation = pipe(
      (x: number[]) => x.map((y) => y + 1),
      (x: number[]) => x.map((y) => y + 2)
    );
    assert.deepEqual(await operation([1, 2, 3]), [4, 5, 6]);
  });

  it("pipes results of different types", async () => {
    const operation = pipe(
      (x: string[]) => x.map((s) => s + "_concat"),
      (x: string[]) => x.map((s) => ({ id: s }))
    );
    assert.deepEqual(await operation(["one", "two", "three"]), [
      { id: "one_concat" },
      { id: "two_concat" },
      { id: "three_concat" },
    ]);
  });

  it("pipes async functions", async () => {
    const operation = pipe(
      async (x: string[]) => x.map((s) => s + "_concat"),
      (x: string[]) => x.map((s) => ({ id: s }))
    );
    assert.deepEqual(await operation(["one", "two", "three"]), [
      { id: "one_concat" },
      { id: "two_concat" },
      { id: "three_concat" },
    ]);
  });

  it("throws an error if no functions are provided", async () => {
    const operation: any = pipe();
    assert.rejects(async () => await operation());
  });

  it("pipes an empty array", async () => {
    const operation = pipe(
      (x: number[]) => x.map((y) => y + 1),
      (x: number[]) => x.map((y) => y + 2)
    );
    assert.deepEqual(await operation([]), []);
  });

  it("pipes a single array", async () => {
    const operation = pipe((x: number[]) => x.map((y) => y + 1));
    assert.deepEqual(await operation([1, 2, 3]), [2, 3, 4]);
  });

  it("pipes an array of heterogeneous objects", async () => {
    const operation = pipe(
      (x: (number | { foo: string })[]) =>
        x.map((y) => {
          if (typeof y === "object") {
            return {
              bar: y.foo,
            };
          } else {
            return y + 1;
          }
        }),
      (x: (number | { bar: string })[]) =>
        x.map((y) => {
          if (typeof y === "object") {
            return {
              baz: y.bar,
            };
          } else {
            return y + 1;
          }
        })
    );
    assert.deepEqual(await operation([1, { foo: "dog" }, 2]), [
      3,
      { baz: "dog" },
      4,
    ]);
  });

  it("raises type error if interior pipe types do not align", () => {
    const operation = pipe(
      (x: number[]) => ["foo"],
      (x: { id: string }) => [1],
      (x: number[]) => [2]
    );
    //@ts-expect-error
    const test = operation([]);
  });

  it("raises type error if input type is not an array", () => {
    const operation = pipe(
      (x: number) => ["foo"],
      (x: string[]) => [1]
    );
    // @ts-expect-error
    const test = operation([]);
  });

  it("raises type error if interior pipe is not array type", () => {
    const operation = pipe(
      (x: number[]) => ["foo"],
      (x: string) => [1],
      (x: number[]) => [2]
    );

    // @ts-expect-error
    const test = operation([]);
  });

  it("raises type error if piped object types are not overlapping", () => {
    const operation = pipe(
      (x: { foo: string }[]) => [{ bar: "bar" }],
      (x: { baz: string }[]) => [1]
    );

    // @ts-expect-error
    const test = operation([{ foo: "foo" }]);
  });

  it("raises type error if functions have more than one argument", () => {
    const operation = pipe((x: { foo: string }[], y: { bar: string }) => [
      { bar: "bar" },
    ]);

    // @ts-expect-error
    const test = operation([{ foo: "foo" }]);
  });

  it("raises type error if promise return value does not align with input", () => {
    const operation = pipe(
      async (x: string[]) => ["test"],
      (x: number[]) => [2]
    );

    // @ts-expect-error
    const test = operation();
  });
});

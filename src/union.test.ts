import assert from "node:assert";
import { describe, it } from "node:test";
import { union } from "./union";

describe("union()", () => {
  it("returns union of all input functions for numbers", async () => {
    const operation = union(
      () => [1, 3, 5, 7, 9],
      () => [2, 4, 6, 7, 9],
      () => [0, 7]
    );
    assert.deepEqual(await operation([]), [1, 3, 5, 7, 9, 2, 4, 6, 0]);
  });

  it("returns union of all input functions for objects with ids", async () => {
    const operation = union(
      () => [{ id: "bar", foo: "bar" }, { id: "foo" }, { id: "baz" }],
      () => [{ id: "foo" }, { id: "baz" }, { id: "qux" }],
      () => [{ id: "foo" }, { id: "baz" }, { id: "quux" }]
    );
    assert.deepEqual(await operation([]), [
      { id: "bar", foo: "bar" },
      { id: "foo" },
      { id: "baz" },
      { id: "qux" },
      { id: "quux" }
    ]);
  });

  it("allows mixing of objects and primitives", async () => {
    const operation = union(
      () => [1, { id: "foo" }, "foo", null, undefined],
      () => [{ id: "foo" }, 1, null],
      () => [{ id: "foo" }, { id: "baz" }, null, 1]
    );
    assert.deepEqual(await operation([]), [
      1,
      { id: "foo" },
      "foo",
      null,
      undefined,
      { id: "baz" }
    ]);
  });

  it("returns an empty array if no functions are provided", async () => {
    const operation = union();
    assert.deepEqual(await operation([]), []);
  });

  it("returns an empty array if no results are found", async () => {
    const operation = union(
      () => [],
      () => [],
      () => []
    );
    assert.deepEqual(await operation([]), []);
  });

  it("produces a compile error if the input types are not the same", async () => {
    union(
      (arr: string[]) => [1, 2, 3],
      // @ts-expect-error
      (arr: number[]) => [1, 2, 3]
    );
  });

  it("produces a compile error if the output types are not the same", async () => {
    union(
      (arr: string[]) => [1, 2, 3],
      // @ts-expect-error
      (arr: string[]) => ["foo", "bar", "baz"]
    );
  });

  it("produces a compile error if all output object types do not have an id", async () => {
    union(
      () => [{ foo: "bar", id: "foo" }],
      // @ts-expect-error
      () => [{ foo: "bar" }],
    );
  });

  it("produces a compile error if all input object types do not have an id", async () => {
    union(
      (arr: { id: string; foo: string }[]) => [{ foo: "bar", id: "foo" }],
      // @ts-expect-error
      (arr: { foo: string }[]) => [{ foo: "bar" }],
    );
  });
});
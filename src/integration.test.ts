import assert from "node:assert";
import { describe, it } from "node:test";
import { pipe } from "./pipe";
import { union } from "./union";
import { intersection } from "./intersection";

const lessThan =
  (num: number) => async (arr: (number | { id: string; value: number })[]) =>
    arr.filter((item) =>
      typeof item === "number" ? item < num : item.value < num
    );
const greaterThan =
  (num: number) => async (arr: (number | { id: string; value: number })[]) =>
    arr.filter((item) =>
      typeof item === "number" ? item > num : item.value > num
    );

describe("Integration of pipe, union, and intersection", () => {
  it("combines union and intersection in a pipe", async () => {
    const operation = pipe(
      union(greaterThan(8), lessThan(5)),
      intersection(lessThan(9), greaterThan(3))
    );

    assert.deepEqual(
      await operation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      // union of > 10 and < 5 = [1, 2, 3, 4, 9, 10]
      // intersection of < 9 and > 3 = [4]
      [4]
    );
  });

  it("combines union and intersection in a pipe with complex objects", async () => {
    const operation = pipe(
      union(greaterThan(4), lessThan(2)),
      intersection(lessThan(9), greaterThan(3))
    );
    assert.deepEqual(
      await operation([
        { id: "a", value: 1 },
        { id: "b", value: 2 },
        { id: "c", value: 3 },
        { id: "d", value: 4 },
        { id: "e", value: 5 },
        { id: "f", value: 6 },
        { id: "g", value: 7 },
        { id: "h", value: 8 },
        { id: "i", value: 9 },
        { id: "j", value: 10 },
      ]),
      // union of > 4 and < 2 = [1, 5, 6, 7, 8, 9, 10]
      // intersection of < 9 and > 3 = [5, 6, 7, 8]
      [
        { id: "e", value: 5 },
        { id: "f", value: 6 },
        { id: "g", value: 7 },
        { id: "h", value: 8 },
      ]
    );
  });

  it("raises a compile error if piped functions are not compatible", async () => {
    const operation = pipe(
      union(async (arr: number[]): Promise<number[]> => []),
      intersection(async (arr: string[]): Promise<string[]> => [])
    );
    // @ts-expect-error
    const test = await operation([]);
  });

  type TypeA = { id: string; foo: number };
  type TypeB = { id: string; bar: string };
  it("raises a compile error if piped functions are not compatible with complex objects", async () => {
    const operation = pipe(
      union(async (): Promise<TypeA[]> => []),
      intersection(async (arr: TypeB[]): Promise<TypeB[]> => [])
    );
    // @ts-expect-error
    const test = await operation([]);
  });
});

import assert from "node:assert";
import { describe, it } from "node:test";
import { intersection } from "./intersection";

describe("intersection()", () => {
  it("returns intersection of all input functions for numbers", async () => {
    const operation = intersection(
      () => [1, 3, 5, 7, 9],
      () => [2, 4, 6, 7, 9],
      () => [0, 7]
    );
    assert.deepEqual(await operation([]), [7]);
  });
});

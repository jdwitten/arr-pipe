import { AnyElement, ArrayFunction, AnyOutputElement } from "./types";
import { hashElement } from "./util";

export function intersection<
  TInput extends AnyElement,
  TOutput extends AnyOutputElement
>(...fns: ArrayFunction<TInput, TOutput>[]): ArrayFunction<TInput, TOutput> {
  return async (input) => {
    const allResultSets: Set<TOutput | string>[] = [];
    const hashToValues: Map<TOutput | string, TOutput> = new Map();

    for (const fn of fns) {
      const results = await fn(input);
      const hashedResults: Set<TOutput | string> = new Set();
      for (const result of results) {
        const hash = hashElement(result);
        hashToValues.set(hash, result);
        hashedResults.add(hash);
      }
      allResultSets.push(hashedResults);
    }

    const [firstSet, ...otherSets] = allResultSets;
    const finalResultSet = otherSets.reduce(
      (cummulative, current) => cummulative.intersection(current),
      firstSet ?? new Set()
    );

    return Array.from(finalResultSet.values()).map((hash) => {
      const value = hashToValues.get(hash);
      if (value === undefined) {
        throw new Error("Could not find value");
      }
      return value;
    });
  };
}

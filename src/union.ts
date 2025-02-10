import { ArrayFunction, BaseElement } from "./types";
import { hashElement } from "./util";

export function union<TInput extends BaseElement, TOutput extends BaseElement>(
  ...fns: ArrayFunction<TInput, TOutput>[]
): ArrayFunction<TInput, TOutput> {
  return async (input: TInput[]) => {
    const results: Map<string | TOutput, TOutput> = new Map();
    for (const fn of fns) {
      const result = await fn(input);
      for (const item of result) {
        results.set(hashElement(item), item);
      }
    }
    return Array.from(results.values());
  };
}

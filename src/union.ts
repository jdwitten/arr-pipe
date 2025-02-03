import { AnyElement, AnyOutputElement, ArrayFunction } from "./types";

export function union<
  TInput extends AnyElement = AnyElement,
  TOutput extends AnyOutputElement = AnyOutputElement
>(...fns: ArrayFunction<TInput, TOutput>[]): ArrayFunction<TInput, TOutput> {
  return async (input: TInput[]) => {
    const resultIds: Set<string> = new Set();
    const resultSet: Set<TOutput> = new Set();
    for (const fn of fns) {
      const result = await fn(input);
      for (const item of result) {
        if (item != null && "id" in item && !resultIds.has(item.id)) {
          resultIds.add(item.id);
          resultSet.add(item);
        } else {
          resultSet.add(item);
        }
      }
    }
    return Array.from(resultSet);
  };
}

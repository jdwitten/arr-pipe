import { ArrayFunction, AnyFunction, PromiseValue } from "./types";

type INVALID_FN_ERROR_MESSAGE =
  "One of the parameters to pipe() is not a valid function. All parameters must be a function that takes 1 array argument and returns and array";

type MISMATCH_TYPE_ERROR_MESSAGE_PROMISE =
  "One of the piped function's Promise return value type does not align with the expected input type of the next function.";
type MISMATCH_TYPE_ERROR_MESSAGE =
  "One of the piped function's return type does not align with the expected input type of the next function.";

type FindAndValidateReturn<
  TFirst extends AnyFunction,
  TRest extends Array<AnyFunction>
> = TRest extends never[]
  ? ReturnType<TFirst>
  : TRest extends [infer TNext, ...infer TRestRest]
  ? TNext extends never
    ? ReturnType<TFirst>
    : TRestRest extends Array<AnyFunction>
    ? TNext extends AnyFunction
      ? ReturnType<TFirst> extends Parameters<TNext>[0]
        ? FindAndValidateReturn<TNext, TRestRest>
        : PromiseValue<ReturnType<TFirst>> extends Parameters<TNext>[0]
        ? FindAndValidateReturn<TNext, TRestRest>
        : {
            error: MISMATCH_TYPE_ERROR_MESSAGE_PROMISE;
          }
      : {
          error: MISMATCH_TYPE_ERROR_MESSAGE;
        }
    : { error: INVALID_FN_ERROR_MESSAGE }
  : { error: INVALID_FN_ERROR_MESSAGE };

type PipedFunctions<T extends Array<ArrayFunction>> = T extends [
  infer TFirst,
  ...infer TRest
]
  ? TFirst extends AnyFunction
    ? TRest extends never[]
      ? (input: Parameters<TFirst>[0]) => ReturnType<TFirst>
      : TRest extends Array<AnyFunction>
      ? FindAndValidateReturn<TFirst, TRest> extends { error: string }
        ? FindAndValidateReturn<TFirst, TRest>
        : (
            input: Parameters<TFirst>[0]
          ) => Promise<FindAndValidateReturn<TFirst, TRest>>
      : {
          error: INVALID_FN_ERROR_MESSAGE;
        }
    : {
        error: INVALID_FN_ERROR_MESSAGE;
      }
  : {
      error: INVALID_FN_ERROR_MESSAGE;
    };

export function pipe<T extends any[]>(...fns: T): PipedFunctions<T> {
  return (async (input: any) => {
    if (fns.length === 0) {
      throw new Error(
        `pipe() requires at least one function argument, but was provided none.`
      );
    }
    let result: any = input;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  }) as unknown as PipedFunctions<T>;
}

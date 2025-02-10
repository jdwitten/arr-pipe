export type IdObject<T> = T extends { id: string } ? T : never;
export type AnyElement<T> = T extends object
  ? IdObject<T>
  : string | number | boolean | null | undefined;

export type AnyOutputElement<T> = AnyElement<T> | Promise<AnyElement<T>>;

export type BaseElement =
  | { id: string }
  | string
  | number
  | boolean
  | null
  | undefined;

export type ArrayFunction<TInput = BaseElement, TOutput = BaseElement> =
  | ((arg: TInput[]) => TOutput[])
  | ((arg: TInput[]) => Promise<TOutput[]>);

export type AnyFunction =
  | ((input: any[]) => any[])
  | ((input: any[]) => Promise<any[]>);

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

export type InputElementType<T> = T extends (
  input: Array<infer ElementType>
) => any[]
  ? ElementType
  : never;

export type OutputElementType<T> = T extends (
  input: any[]
) => Array<infer ElementType>
  ? ElementType
  : never;

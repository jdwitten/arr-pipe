import { BaseElement } from "./types";

export function hashElement<TOutput extends BaseElement>(
  obj: TOutput
): TOutput | string {
  return obj != null && typeof obj === "object" && "id" in obj
    ? `__array-pipe-obj-hash:${obj.id}`
    : obj;
}

export function doesMatchHash(element: BaseElement, hash: string): boolean {
  return (
    element != null &&
    typeof element === "object" &&
    hashElement(element) === hash
  );
}

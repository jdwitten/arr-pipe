import { AnyElement, AnyOutputElement } from "./types";

export function hashElement<TOutput extends AnyOutputElement>(
  obj: TOutput
): TOutput | string {
  return obj != null && "id" in obj ? `__array-pipe-obj-hash:${obj.id}` : obj;
}

// export function mapToHashes<TElement extends AnyElement>(
//   arr: TElement[]
// ): Array<TElement | string> {
//   return arr.map((element) => {
//     return element != null && typeof element === "object"
//       ? createObjectHash(element)
//       : element;
//   });
// }

export function doesMatchHash(
  element: AnyOutputElement,
  hash: string
): boolean {
  return (
    element != null &&
    typeof element === "object" &&
    hashElement(element) === hash
  );
}

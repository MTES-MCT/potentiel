// Create object structure for a single path
type CreatePathStructure<T, P extends string> = P extends keyof T
  ? Pick<T, P>
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? { [Key in K]: CreatePathStructure<T[K], Rest> }
      : never
    : never;

// Convert union to intersection
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// Main type - pick fields by dot-notation paths
export type PickByPaths<T, TPaths extends readonly string[]> = UnionToIntersection<
  TPaths[number] extends infer P ? (P extends string ? CreatePathStructure<T, P> : never) : never
>;

// From https://gist.github.com/paduc/5d1322e3a40ce5415b9477004716df9b

/**
 * Type representing a guard function accepting Input and some other arguments
 * while refining type of input as `Output`
 */
export type TypeGuard<Input, Output extends Input> = (value: Input) => value is Output

/**
 * Combines multiple TypeGuards using `&&` operator
 */
export function and<I, O extends I, O2 extends O>(
  f: TypeGuard<I, O>,
  g: TypeGuard<O, O2>
): TypeGuard<I, O2> {
  return (value: I): value is O2 => f(value) && g(value)
}

/**
 * Combines multiple TypeGuards using `||` operator
 */
export function or<T extends readonly TypeGuard<unknown, unknown>[]>(...typeguards: T) {
  return (value: InputType<TypeGuardOfUnion<T>>): value is GuardedType<TypeGuardOfUnion<T>> =>
    typeguards.some((typeguard) => typeguard(value))
}

// Take an array of TypeGuards and return a union of output types
// Ex: ExtractOutputTypesOfUnion<[TypeGuard<I, O1>, TypeGuard<I, 02>] = 01 | O2
type ExtractOutputTypesOfUnion<T extends readonly TypeGuard<unknown, unknown>[]> = {
  [idx in keyof T]: T[idx] extends TypeGuard<unknown, infer V> ? V : never
}[number]

// Take an array of TypeGuards and return the input type
// it takes the input type of the first (since they are all the same)
type ExtractInputTypeOfUnion<
  T extends readonly TypeGuard<unknown, unknown>[]
> = T[0] extends TypeGuard<infer U, any> ? U : never

// Build a full TypeGuard type with the two previous
// enforces the constraint that the output extends the input
type TypeGuardOfUnion<
  T extends readonly TypeGuard<unknown, unknown>[],
  Input = ExtractInputTypeOfUnion<T>,
  Output = ExtractOutputTypesOfUnion<T>
> = Output extends Input ? TypeGuard<Input, Output> : never

// Returns the return type of a TypeGuard<I, O> ("value is O")
type GuardedType<T> = T extends (x: any) => x is infer T ? T : never

// Returns the input type of a TypeGuard (type of first parameter)
type InputType<T extends (...args: any) => any> = Parameters<T>[0]

export type ForceArrayType<T extends any[] | any> = T extends any[] ? T : T[]
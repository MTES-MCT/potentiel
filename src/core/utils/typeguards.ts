// From https://gist.github.com/safareli/8e480d72f7e2665b6030b9a08fe93f40

/**
 * Type representing a guard function accepting Input and some other arguments
 * while refining type of input as `Output`
 */
export type TypeGuard<Input, Output extends Input, Args extends unknown[] = []> = (
  value: Input,
  ...args: Args
) => value is Output

/**
 * Combines multiple TypeGuards using `&&` operator
 */
export function and<I, O extends I, O2 extends O, A extends unknown[] = []>(
  f: TypeGuard<I, O, A>,
  g: TypeGuard<O, O2, A>
): TypeGuard<I, O2, A> {
  return (value: I, ...args: A): value is O2 => f(value, ...args) && g(value, ...args)
}
/**
 * Combines multiple TypeGuards using `||` operator
 */
export function or<I, O extends I, O2 extends I, A extends unknown[] = []>(
  f: TypeGuard<I, O, A>,
  g: TypeGuard<I, O2, A>
): TypeGuard<I, O | O2, A> {
  return (value: I, ...args: A): value is O | O2 => f(value, ...args) || g(value, ...args)
}

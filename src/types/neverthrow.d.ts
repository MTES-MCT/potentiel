/* eslint-disable */

declare module 'neverthrow' {
  type Result<T, E> = Ok<T, E> | Err<T, E>
  const ok: <T, E>(value: T) => Ok<T, E>
  const err: <T, E>(err: E) => Err<T, E>
  class Ok<T, E> {
    readonly value: T
    constructor(value: T)
    isOk(): this is Ok<T, E>
    isErr(): this is Err<T, E>
    map<A>(f: (t: T) => A): Result<A, E>
    mapErr<U>(_f: (e: E) => U): Result<T, U>
    andThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F>
    asyncAndThen<U, F>(f: (t: T) => ResultAsync<U, F>): ResultAsync<U, E | F>
    asyncMap<U>(f: (t: T) => Promise<U>): ResultAsync<U, E>
    unwrapOr(_v: T): T
    match: <A>(ok: (t: T) => A, _err: (e: E) => A) => A
    _unsafeUnwrap(): T
    _unsafeUnwrapErr(): E
  }
  class Err<T, E> {
    readonly error: E
    constructor(error: E)
    isOk(): this is Ok<T, E>
    isErr(): this is Err<T, E>
    map<A>(_f: (t: T) => A): Result<A, E>
    mapErr<U>(f: (e: E) => U): Result<T, U>
    aandThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F>
    asyncAndThen<U, F>(f: (t: T) => ResultAsync<U, F>): ResultAsync<U, E | F>
    asyncMap<U>(f: (t: T) => Promise<U>): ResultAsync<U, E>
    unwrapOr(v: T): T
    match: <A>(_ok: (t: T) => A, err: (e: E) => A) => A
    _unsafeUnwrap(): T
    _unsafeUnwrapErr(): E
  }

  class ResultAsync<T, E> implements PromiseLike<Result<T, E>> {
    private _promise
    constructor(res: Promise<Result<T, E>>)
    static fromPromise<T, E>(promise: Promise<T>, errorFn?: (e: unknown) => E): ResultAsync<T, E>
    map<A>(f: (t: T) => A | Promise<A>): ResultAsync<A, E>
    mapErr<U>(f: (e: E) => U | Promise<U>): ResultAsync<T, U>
    andThen<U, F>(f: (t: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>
    match<A>(ok: (t: T) => A, _err: (e: E) => A): Promise<A>
    unwrapOr(t: T): Promise<T>
    then<A, B>(
      successCallback?: (res: Result<T, E>) => A | PromiseLike<A>,
      failureCallback?: (reason: unknown) => B | PromiseLike<B>
    ): PromiseLike<A | B>
  }
  const okAsync: <T, E>(value: T) => ResultAsync<T, E>
  const errAsync: <T, E>(err: E) => ResultAsync<T, E>

  const chain: <T1, T2, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Promise<Result<T2, E>>
  ) => Promise<Result<T2, E>>
  const chain3: <T1, T2, T3, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Promise<Result<T3, E>>
  ) => Promise<Result<T3, E>>
  const chain4: <T1, T2, T3, T4, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Ok<T3, E> | Err<T3, E> | Promise<Result<T3, E>>,
    r4: (v: T3) => Promise<Result<T4, E>>
  ) => Promise<Result<T4, E>>
  const chain5: <T1, T2, T3, T4, T5, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Ok<T3, E> | Err<T3, E> | Promise<Result<T3, E>>,
    r4: (v: T3) => Ok<T4, E> | Err<T4, E> | Promise<Result<T4, E>>,
    r5: (v: T4) => Promise<Result<T5, E>>
  ) => Promise<Result<T5, E>>
  const chain6: <T1, T2, T3, T4, T5, T6, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Ok<T3, E> | Err<T3, E> | Promise<Result<T3, E>>,
    r4: (v: T3) => Ok<T4, E> | Err<T4, E> | Promise<Result<T4, E>>,
    r5: (v: T4) => Ok<T5, E> | Err<T5, E> | Promise<Result<T5, E>>,
    r6: (v: T5) => Promise<Result<T6, E>>
  ) => Promise<Result<T6, E>>
  const chain7: <T1, T2, T3, T4, T5, T6, T7, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Ok<T3, E> | Err<T3, E> | Promise<Result<T3, E>>,
    r4: (v: T3) => Ok<T4, E> | Err<T4, E> | Promise<Result<T4, E>>,
    r5: (v: T4) => Ok<T5, E> | Err<T5, E> | Promise<Result<T5, E>>,
    r6: (v: T5) => Ok<T6, E> | Err<T6, E> | Promise<Result<T6, E>>,
    r7: (v: T6) => Promise<Result<T7, E>>
  ) => Promise<Result<T7, E>>
  const chain8: <T1, T2, T3, T4, T5, T6, T7, T8, E>(
    r1: Promise<Result<T1, E>>,
    r2: (v: T1) => Ok<T2, E> | Err<T2, E> | Promise<Result<T2, E>>,
    r3: (v: T2) => Ok<T3, E> | Err<T3, E> | Promise<Result<T3, E>>,
    r4: (v: T3) => Ok<T4, E> | Err<T4, E> | Promise<Result<T4, E>>,
    r5: (v: T4) => Ok<T5, E> | Err<T5, E> | Promise<Result<T5, E>>,
    r6: (v: T5) => Ok<T6, E> | Err<T6, E> | Promise<Result<T6, E>>,
    r7: (v: T6) => Ok<T7, E> | Err<T7, E> | Promise<Result<T7, E>>,
    r8: (v: T7) => Promise<Result<T8, E>>
  ) => Promise<Result<T8, E>>

  function combine<T, E>(resultList: Result<T, E>[]): Result<T[], E>
  function combine<T, E>(asyncResultList: ResultAsync<T, E>[]): ResultAsync<T[], E>

  export {
    Err,
    Ok,
    Result,
    ResultAsync,
    chain,
    chain3,
    chain4,
    chain5,
    chain6,
    chain7,
    chain8,
    combine,
    err,
    errAsync,
    ok,
    okAsync,
  }
}

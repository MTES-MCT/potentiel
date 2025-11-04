import { assert, expect } from 'chai';
import { diffJson } from 'diff';
import { ZodSafeParseResult, ZodSafeParseSuccess } from 'zod';

export const deepEqualWithRichDiff = (actual: object, expected: object) => {
  try {
    expect(actual).to.deep.equal(expected);
  } catch (e) {
    const diff = diffJson(expected, actual);

    const formattedDiff = diff
      .map((part) => {
        const color = part.added ? '\x1b[32m' : part.removed ? '\x1b[31m' : '\x1b[0m';
        return color + part.value + '\x1b[0m';
      })
      .join('');

    console.log('Difference between actual and expected:\n', formattedDiff);

    const error = e as Record<string, unknown>;
    error.diff = diff
      .filter((part) => part.added || part.removed)
      .map((part) => (part.added ? { actual: part.value } : { expected: part.value }));
    throw error;
  }
};

export function assertNoError<TOutput>(
  result: ZodSafeParseResult<TOutput>,
): asserts result is ZodSafeParseSuccess<TOutput> {
  if (!result.success) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result.error).to.be.undefined;
  }
  assert(result.success);
}

export function assertError<TOutput>(
  result: ZodSafeParseResult<TOutput>,
  path: string[],
  message: string,
  index = 0,
): asserts result is ZodSafeParseResult<TOutput> {
  if (!result.error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result.data).to.be.undefined;
  }
  assert(result.error);
  expect(result.error.issues[index].path).to.deep.eq(path);
  expect(result.error.issues[index].message).to.eq(message);
}

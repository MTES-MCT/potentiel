import * as zod from 'zod';

import { DomainError } from '@potentiel-domain/core';
import { CsvError, CsvValidationError } from '@potentiel-libraries/csv';

export type ActionResult = {
  successCount: number;
  errors: Array<{
    referenceDossier: string;
    reason: string;
  }>;
};

export type FormState =
  | {
      status: 'success' | undefined;
      result?: ActionResult;
    }
  | {
      status: 'form-error';
      errors: string[];
    }
  | {
      status: 'domain-error';
      message: string;
    }
  | {
      status: 'csv-error';
      errors: Array<CsvError>;
    }
  | {
      status: 'unknown-error';
    };

export type FormAction<
  TState,
  TSchema extends
    | zod.AnyZodObject
    | zod.ZodDiscriminatedUnion<string, zod.AnyZodObject[]> = zod.AnyZodObject,
> = (previousState: TState, data: zod.infer<TSchema>) => Promise<TState>;

const TWO_SECONDS = 2000;

export const formAction =
  <
    TSchema extends zod.AnyZodObject | zod.ZodDiscriminatedUnion<string, zod.AnyZodObject[]>,
    TState extends FormState,
  >(
    action: FormAction<TState, TSchema>,
    schema?: TSchema,
  ) =>
  async (previousState: TState, formData: FormData) => {
    try {
      const data = schema
        ? await schema.parseAsync(Object.fromEntries(formData))
        : Object.fromEntries(formData);

      const result = await action(previousState, data);

      await waitToAvoidConsistencyProblemsInApp(TWO_SECONDS);

      return result;
    } catch (e) {
      if (e instanceof CsvValidationError) {
        return {
          status: 'csv-error' as const,
          errors: e.errors,
        };
      }

      if (e instanceof zod.ZodError) {
        return {
          status: 'form-error' as const,
          errors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
        };
      }

      if (e instanceof DomainError) {
        return {
          status: 'domain-error' as const,
          message: e.message,
        };
      }

      return {
        status: 'unknown-error' as const,
      };
    }
  };

const waitToAvoidConsistencyProblemsInApp = (timeInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timeInMs));

import * as zod from 'zod';

// import { getLogger } from '@potentiel/monitoring';
import { DomainError } from '@potentiel-domain/core';

import { CsvResult } from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/importDatesMiseEnService.action';

import { CsvError, CsvValidationError } from './parseCsv';

export type FormState =
  | {
      status: 'success' | undefined;
    }
  | {
      status: 'csv-success';
      result: CsvResult;
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

export type FormAction<TState, TSchema extends zod.AnyZodObject = zod.AnyZodObject> = (
  previousState: TState,
  data: zod.infer<TSchema>,
) => Promise<TState>;

export const formAction =
  <TSchema extends zod.AnyZodObject, TState extends FormState>(
    action: FormAction<TState, TSchema>,
    schema?: TSchema,
  ) =>
  async (previousState: TState, formData: FormData) => {
    try {
      const data = schema
        ? schema.parse(Object.fromEntries(formData))
        : Object.fromEntries(formData);

      return await action(previousState, data);
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

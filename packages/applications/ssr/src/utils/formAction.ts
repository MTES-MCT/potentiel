import * as zod from 'zod';
import i18next from 'i18next';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/fr/zod.json';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { isNotFoundError } from 'next/dist/client/components/not-found';

import { DomainError } from '@potentiel-domain/core';
import { CsvError, CsvValidationError } from '@potentiel-libraries/csv';
import { getLogger } from '@potentiel-libraries/monitoring';
import { unflatten } from '@potentiel-libraries/flat';

import { applySearchParams } from '../app/_helpers';

i18next.init({
  lng: 'fr',
  resources: {
    fr: { zod: translation },
  },
});
zod.setErrorMap(zodI18nMap);

export type ActionResult = {
  successCount: number;
  errors: Array<{
    key: string;
    reason: string;
  }>;
};

export type ValidationErrors<TKeys extends string = string> = Partial<Record<TKeys, string>>;

export type FormState =
  | {
      status: 'success' | undefined;
      result?: ActionResult;
      redirection?: {
        url: string;
        message?: string;
      };
    }
  | {
      status: 'validation-error';
      errors: ValidationErrors;
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

export type FormAction<TState, TSchema extends zod.ZodType = zod.AnyZodObject> = (
  previousState: TState,
  data: zod.infer<TSchema>,
) => Promise<TState>;

const TWO_SECONDS = 2000;

export const formAction =
  <TSchema extends zod.ZodType, TState extends FormState>(
    action: FormAction<TState, TSchema>,
    schema?: TSchema,
  ) =>
  async (previousState: TState, formData: FormData) => {
    try {
      const allKeys = Array.from(formData.keys());

      const dataReduced = allKeys.reduce((acc, formKey) => {
        if (Object.hasOwn(acc, formKey)) {
          return acc;
        }

        if (allKeys.filter((key) => key === formKey)?.length > 1) {
          return {
            ...acc,
            [formKey]: formData.getAll(formKey),
          };
        }

        return {
          ...acc,
          [formKey]: formData.get(formKey),
        };
      }, {});

      const data = schema
        ? await schema.parseAsync(unflatten(dataReduced))
        : unflatten(dataReduced);

      const result = await action(previousState, data);

      await waitFor(TWO_SECONDS);

      if (result.status === 'success' && result.redirection) {
        revalidatePath(result.redirection.url);
        redirect(
          applySearchParams(
            result.redirection.url,
            result.redirection.message ? { success: result.redirection.message } : {},
          ),
        );
      }

      return result;
    } catch (e) {
      if (isRedirectError(e) || isNotFoundError(e)) {
        throw e;
      }
      if (e instanceof CsvValidationError) {
        return {
          status: 'csv-error' as const,
          errors: e.errors,
        };
      }

      if (e instanceof zod.ZodError) {
        const errors = e.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message.trim() ?? '';
          return acc;
        }, {} as ValidationErrors);

        return {
          status: 'validation-error' as const,
          errors,
        };
      }

      if (e instanceof DomainError) {
        return {
          status: 'domain-error' as const,
          message: e.message,
        };
      }

      getLogger().error(e as Error);

      return {
        status: 'unknown-error' as const,
      };
    }
  };

const waitFor = (timeInMs: number) => new Promise((resolve) => setTimeout(resolve, timeInMs));

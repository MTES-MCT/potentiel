import { DomainError } from '@potentiel-domain/core';
import { ImportCSV } from '@potentiel-libraries/csv';
import { getLogger } from '@potentiel-libraries/monitoring';
import { unflatten } from 'flat';
import { revalidatePath } from 'next/cache';
import { redirect, unstable_rethrow } from 'next/navigation';
import * as zod from 'zod';

import { applySearchParams } from '@/app/_helpers';

import './zod/setupLocale';
import { CsrfError, verifyCsrfToken } from './csrf';
import { TooManyRequestsError } from './withRateLimit';
import { callbackURLSchema } from './zod/auth';
import { cookies } from 'next/headers';

export type ActionResult = {
  successMessage: string;
  link?: {
    url: string;
    label: string;
  };
  errors: Array<{
    key: string;
    reason: string;
  }>;
};

export type ValidationErrors<TKeys extends string = string> = Partial<Record<TKeys, string>>;

type FormStateSuccess = {
  status: 'success' | undefined;
  result?: ActionResult;
  redirection?: {
    url: string;
    message?: string;
    linkUrl?: { url: string; label: string };
  };
};

type FormStateValidationError = {
  status: 'validation-error';
  errors: ValidationErrors;
};

type FormStateRateLimitError = {
  status: 'rate-limit-error';
  message: string;
};

type FormStateDomainError = {
  status: 'domain-error';
  message: string;
};

export type FormStateCsvLineError = {
  status: 'csv-line-error';
  errors: Array<ImportCSV.CsvLineError>;
};

export type FormStateCsvMissingColumnError = {
  status: 'csv-missing-column-error';
  columns: Array<ImportCSV.CsvMissingColumnError>;
};

export type FormStateCsvDuplicateColumnError = {
  status: 'csv-duplicate-header-error';
  columns: Array<ImportCSV.CsvDuplicateHeaderError>;
};

export type FormStateCsrfError = {
  status: 'csrf-error';
};

type FormStateUnknownError = {
  status: 'unknown-error';
};

export type FormState =
  | FormStateSuccess
  | FormStateValidationError
  | FormStateRateLimitError
  | FormStateDomainError
  | FormStateCsvLineError
  | FormStateCsvMissingColumnError
  | FormStateUnknownError
  | FormStateCsvDuplicateColumnError
  | FormStateCsrfError;

export type FormAction<TState extends FormState, TSchema extends zod.ZodType = zod.ZodObject> = (
  previousState: TState,
  data: zod.infer<TSchema>,
) => Promise<TState>;

export const formAction =
  <TSchema extends zod.ZodType, TState extends FormState>(
    action: FormAction<TState, TSchema>,
    schema?: TSchema,
  ) =>
  async (previousState: TState, formData: FormData): Promise<FormState> => {
    try {
      await verifyCsrfToken(formData, await cookies());
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
      const result = await action(previousState, data as zod.infer<TSchema>);

      // Si le formulaire contient un champ "retour" valide, on redirige vers cette url en priorité.
      const parsedRetour = zod.object({ retour: callbackURLSchema }).safeParse(dataReduced);

      if (result.status === 'success' && parsedRetour.success) {
        result.redirection = {
          url: parsedRetour.data.retour,
          message: result.result?.successMessage,
          linkUrl: result.result?.link,
        };
      }

      if (result.status === 'success' && result.redirection) {
        /**
         * Attendre un certain délai avant de faire la redirection pour laisser le temps à la projection d'update
         * La durée est configurable via la variable d'environnement FORM_REDIRECTION_DELAY_MS
         * En l'absence de variable d'environnement, pas de délai
         */
        await new Promise((resolve) =>
          setTimeout(resolve, Number(process.env.FORM_REDIRECTION_DELAY_MS ?? '0')),
        );

        revalidatePath(result.redirection.url);

        const searchParams: Record<string, string> = {};
        if (result.redirection.message) {
          searchParams.success = result.redirection.message;
        }
        if (result.redirection.linkUrl) {
          searchParams.linkUrl = result.redirection.linkUrl.url;
          searchParams.linkUrlLabel = result.redirection.linkUrl.label;
        }

        redirect(applySearchParams(result.redirection.url, searchParams));
      }

      return result;
    } catch (e) {
      unstable_rethrow(e);

      if (e instanceof ImportCSV.CsvLineValidationError) {
        return {
          status: 'csv-line-error',
          errors: e.errors,
        };
      }
      if (e instanceof ImportCSV.MissingRequiredColumnError) {
        return {
          status: 'csv-missing-column-error',
          columns: e.missingColumns,
        };
      }
      if (e instanceof ImportCSV.DuplicateHeaderError) {
        return {
          status: 'csv-duplicate-header-error',
          columns: e.duplicateHeaders,
        };
      }

      if (e instanceof zod.ZodError) {
        const errors = e.issues.reduce((acc, issue) => {
          const path = issue.path.join('.');
          acc[path] = issue.message.trim() ?? '';
          return acc;
        }, {} as ValidationErrors);

        return {
          status: 'validation-error',
          errors,
        };
      }

      if (e instanceof TooManyRequestsError) {
        return {
          status: 'rate-limit-error',
          message: e.message,
        };
      }

      if (e instanceof CsrfError) {
        getLogger().warn('CSRF token verification failed', {
          error: e.message,
        });
        return {
          status: 'csrf-error',
        };
      }

      if (DomainError.isDomainError(e)) {
        return {
          status: 'domain-error',
          message: e.message,
        };
      }

      getLogger().error(e as Error);

      return {
        status: 'unknown-error',
      };
    }
  };

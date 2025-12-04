import * as zod from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// eslint-disable-next-line no-restricted-imports
import { isRedirectError } from 'next/dist/client/components/redirect';
// eslint-disable-next-line no-restricted-imports
import { isNotFoundError } from 'next/dist/client/components/not-found';

import { DomainError } from '@potentiel-domain/core';
import {
  CsvLineError,
  CsvColumnError,
  CsvLineValidationError,
  CsvColumnValidationError,
} from '@potentiel-libraries/csv';
import { getLogger } from '@potentiel-libraries/monitoring';
import { unflatten } from '@potentiel-libraries/flat';

import { applySearchParams } from '@/app/_helpers';

import './zod/setupLocale';
import { TooManyRequestsError } from './withRateLimit';

export type ActionResult = {
  successMessage: string;
  link?: {
    href: string;
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
  errors: Array<CsvLineError>;
};

export type FormStateCsvColumnError = {
  status: 'csv-column-error';
  errors: Array<CsvColumnError>;
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
  | FormStateCsvColumnError
  | FormStateUnknownError;

export type FormAction<TState extends FormState, TSchema extends zod.ZodType = zod.ZodObject> = (
  previousState: TState,
  data: zod.infer<TSchema>,
) => Promise<TState>;

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

      const result = await action(previousState, data as zod.infer<TSchema>);

      if (result.status === 'success' && result.redirection) {
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
      if (isRedirectError(e) || isNotFoundError(e)) {
        throw e;
      }
      if (e instanceof CsvLineValidationError) {
        return {
          status: 'csv-line-error' as const,
          errors: e.errors,
        };
      }
      if (e instanceof CsvColumnValidationError) {
        return {
          status: 'csv-column-error' as const,
          errors: e.errors,
        };
      }

      if (e instanceof zod.ZodError) {
        const errors = e.issues.reduce((acc, issue) => {
          const path = issue.path.join('.');
          acc[path] = issue.message.trim() ?? '';
          return acc;
        }, {} as ValidationErrors);

        return {
          status: 'validation-error' as const,
          errors,
        };
      }

      if (e instanceof TooManyRequestsError) {
        return {
          status: 'rate-limit-error' as const,
          message: e.message,
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

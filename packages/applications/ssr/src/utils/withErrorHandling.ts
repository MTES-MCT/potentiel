// eslint-disable-next-line no-restricted-imports
import { isNotFoundError } from 'next/dist/client/components/not-found';
// eslint-disable-next-line no-restricted-imports
import { isRedirectError } from 'next/dist/client/components/redirect';
import z from 'zod';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { AuthenticationError } from '@potentiel-applications/bootstrap';

export async function withErrorHandling<TResult>(
  action: () => Promise<TResult>,
  onDomainError: (error: DomainError) => TResult,
  onAuthenticationError: () => TResult,
  onValidationError: (error: z.ZodError) => TResult,
  onUnknownError: (error: Error) => TResult,
): Promise<TResult> {
  try {
    return await action();
  } catch (e) {
    if (isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if (e instanceof AuthenticationError) {
      return onAuthenticationError();
    }

    if (e instanceof z.ZodError) {
      getLogger().warn('Validation error: ' + e.message);
      return onValidationError(e);
    }

    if (e instanceof DomainError) {
      getLogger().warn(e.message);
      return onDomainError(e);
    }

    getLogger().error(e as Error);
    return onUnknownError(e as Error);
  }
}

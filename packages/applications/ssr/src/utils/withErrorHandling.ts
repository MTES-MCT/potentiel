import { unstable_rethrow } from 'next/navigation';
import z from 'zod';

import { AuthenticationError } from '@potentiel-applications/bootstrap';
import { DomainError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';

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
    unstable_rethrow(e);

    if (e instanceof AuthenticationError) {
      return onAuthenticationError();
    }

    if (e instanceof z.ZodError) {
      getLogger().warn('Validation error: ' + e.message);
      return onValidationError(e);
    }

    if (DomainError.isDomainError(e)) {
      getLogger().warn(e.message);
      return onDomainError(e);
    }

    getLogger().error(e as Error);
    return onUnknownError(e as Error);
  }
}

import { isNotFoundError } from 'next/dist/client/components/not-found';
import { isRedirectError } from 'next/dist/client/components/redirect';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { NoAuthenticatedUserError } from '@potentiel-applications/request-context';

export async function withErrorHandling<TResult>(
  action: () => Promise<TResult>,
  onDomainError: (error: DomainError) => TResult,
  onAuthenticationError: () => TResult,
  onUnknownError: (error: Error) => TResult,
): Promise<TResult> {
  try {
    return await action();
  } catch (e) {
    if (isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if (e instanceof NoAuthenticatedUserError) {
      return onAuthenticationError();
    }

    if (e instanceof DomainError) {
      getLogger().warn(e.message);
      return onDomainError(e);
    }

    getLogger().error(e as Error);
    return onUnknownError(e as Error);
  }
}

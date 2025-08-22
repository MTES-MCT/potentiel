// biome-ignore lint/style/noRestrictedImports: missing type in next exports, check again in Next 15
import { isNotFoundError } from 'next/dist/client/components/not-found';
// biome-ignore lint/style/noRestrictedImports: missing type in next exports, check again in Next 15
import { isRedirectError } from 'next/dist/client/components/redirect';

import { AuthenticationError } from '@potentiel-applications/bootstrap';
import { NoAuthenticatedUserError } from '@potentiel-applications/request-context';
import { DomainError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';

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

    if (e instanceof NoAuthenticatedUserError || e instanceof AuthenticationError) {
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

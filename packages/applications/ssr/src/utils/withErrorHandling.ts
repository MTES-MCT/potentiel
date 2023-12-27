import { isRedirectError } from 'next/dist/client/components/redirect';
import { isNotFoundError } from 'next/dist/client/components/not-found';

import { DomainError } from '@potentiel-domain/core';
import { getLogger } from '@potentiel/monitoring';

export async function withErrorHandling<TResult>(
  action: () => Promise<TResult>,
  onDomainError: (error: DomainError) => TResult,
  onUnknowmError: (error: Error) => TResult,
): Promise<TResult> {
  try {
    return await action();
  } catch (e) {
    if (isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if (e instanceof DomainError) {
      getLogger().warn(e.message);
      return onDomainError(e);
    }

    getLogger().error(e as Error);
    return onUnknowmError(e as Error);
  }
}

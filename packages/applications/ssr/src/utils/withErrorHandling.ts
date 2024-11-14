import { isNotFoundError } from 'next/dist/client/components/not-found';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainError } from '@potentiel-domain/core';
import { bootstrap } from '@potentiel-applications/bootstrap';
import { permissionMiddleware } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { NoAuthenticatedUserError } from './getAuthenticatedUser.handler';

export async function withErrorHandling<TResult>(
  action: () => Promise<TResult>,
  onDomainError: (error: DomainError) => TResult,
  onUnknowmError: (error: Error) => TResult,
): Promise<TResult> {
  try {
    await bootstrap({ middlewares: [permissionMiddleware] });
    return await action();
  } catch (e) {
    if (isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if (e instanceof NoAuthenticatedUserError) {
      redirect(Routes.Auth.signIn());
    }

    if (e instanceof DomainError) {
      getLogger().warn(e.message);
      return onDomainError(e);
    }

    getLogger().error(e as Error);
    return onUnknowmError(e as Error);
  }
}

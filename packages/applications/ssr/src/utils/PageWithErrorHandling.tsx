'use server';

import { getLogger } from '@potentiel/monitoring';
import {
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel-domain/core';
import { isNotFoundError } from 'next/dist/client/components/not-found';
import { isRedirectError } from 'next/dist/client/components/redirect';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomErrorPage';

export const PageWithErrorHandling = async (
  action: () => Promise<JSX.Element>,
): Promise<JSX.Element> => {
  try {
    return await action();
  } catch (e) {
    if (isRedirectError(e) || isNotFoundError(e)) {
      throw e;
    }

    if (e instanceof NotFoundError) {
      return <CustomErrorPage statusCode="404" type="NotFoundError" />;
    }

    if (e instanceof InvalidOperationError) {
      return <CustomErrorPage statusCode="400" type="InvalidOperationError" />;
    }

    if (e instanceof OperationRejectedError) {
      return <CustomErrorPage statusCode="403" type="OperationRejectedError" />;
    }

    getLogger().error(e as Error);
    return <CustomErrorPage statusCode="500" type="ServerError" />;
  }
};

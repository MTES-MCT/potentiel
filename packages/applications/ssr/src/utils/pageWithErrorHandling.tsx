import {
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel-domain/core';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomErrorPage';

export const pageErrorHandling = async (
  action: () => Promise<JSX.Element>,
): Promise<JSX.Element> => {
  try {
    return await action();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return <CustomErrorPage statusCode="404" type="NotFoundError" />;
    }

    if (e instanceof InvalidOperationError) {
      return <CustomErrorPage statusCode="400" type="InvalidOperationError" />;
    }

    if (e instanceof OperationRejectedError) {
      return <CustomErrorPage statusCode="403" type="OperationRejectedError" />;
    }

    return <CustomErrorPage statusCode="500" type="ServerError" />;
  }
};

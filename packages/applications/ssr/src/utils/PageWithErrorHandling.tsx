'use server';

import {
  DomainError,
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel-domain/core';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';

import { withErrorHandling } from './withErrorHandling';

export const PageWithErrorHandling = async (
  render: () => Promise<JSX.Element>,
): Promise<JSX.Element> => withErrorHandling(render, renderDomainError, renderUnknownError);

const renderDomainError = (error: DomainError) => {
  if (error instanceof NotFoundError) {
    return <CustomErrorPage statusCode="404" type="NotFoundError" />;
  }
  if (error instanceof InvalidOperationError) {
    return <CustomErrorPage statusCode="400" type="InvalidOperationError" />;
  }
  if (error instanceof OperationRejectedError) {
    return <CustomErrorPage statusCode="403" type="OperationRejectedError" />;
  }

  return <></>;
};

const renderUnknownError = () => {
  return <CustomErrorPage statusCode="500" type="ServerError" />;
};

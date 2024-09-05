'use server';

import {
  AggregateNotFoundError,
  DomainError,
  InvalidOperationError,
  OperationRejectedError,
} from '@potentiel-domain/core';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';

import { withErrorHandling } from './withErrorHandling';

export const PageWithErrorHandling = async (
  render: () => Promise<JSX.Element>,
): Promise<JSX.Element> => withErrorHandling(render, renderDomainError, renderUnknownError);

const renderDomainError = (e: DomainError) => {
  if (e instanceof AggregateNotFoundError) {
    return <CustomErrorPage statusCode="404" type="NotFoundError" />;
  }
  if (e instanceof OperationRejectedError) {
    return <CustomErrorPage statusCode="403" type="OperationRejectedError" />;
  }
  if (e instanceof InvalidOperationError) {
    return <CustomErrorPage statusCode="400" type="InvalidOperationError" message={e.message} />;
  }

  return <></>;
};

const renderUnknownError = () => {
  return <CustomErrorPage statusCode="500" type="ServerError" />;
};

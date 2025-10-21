'use server';

import { redirect } from 'next/navigation';
import z from 'zod';

import {
  AggregateNotFoundError,
  DomainError,
  InvalidOperationError,
  OperationRejectedError,
} from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { CustomErrorPage } from '@/app/error/CustomError.page';

import { withErrorHandling } from './withErrorHandling';
import './zod/setupLocale';

export const PageWithErrorHandling = async (
  render: () => Promise<JSX.Element>,
): Promise<JSX.Element> =>
  withErrorHandling(
    render,
    renderDomainError,
    redirectOnAuthenticationError,
    renderValidationError,
    renderUnknownError,
  );

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

const renderUnknownError = (_: Error) => {
  return <CustomErrorPage statusCode="500" type="ServerError" />;
};

const redirectOnAuthenticationError = () => {
  redirect(Routes.Auth.signIn());
};

const renderValidationError = (error: z.ZodError) => {
  const message = error.issues
    .map((issue) => `La valeur de ${issue.path.join('.')} est invalide`)
    .join('. ');

  return <CustomErrorPage statusCode="400" type="InvalidOperationError" message={message} />;
};

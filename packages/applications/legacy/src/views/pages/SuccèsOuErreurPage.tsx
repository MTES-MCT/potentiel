import { Request } from 'express';
import React from 'react';
import { LinkButton, LegacyPageTemplate, SuccessBox, ErrorBox } from '../components';
import { hydrateOnClient } from '../helpers';

interface SuccèsOuErreurProps {
  request: Request;
}

export const SuccèsOuErreur = ({ request }: SuccèsOuErreurProps) => {
  const {
    success,
    error,
    redirectUrl,
    redirectTitle,
  }: {
    success?: string;
    error?: string;
    redirectUrl: string;
    redirectTitle: string;
  } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user}>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      <br />
      <LinkButton className="mt-4" href={redirectUrl}>
        {redirectTitle}
      </LinkButton>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(SuccèsOuErreur);

import type { Request } from 'express';
import React from 'react';
import { Heading2, LegacyPageTemplate } from '../components';
import { hydrateOnClient } from '../helpers';

interface Props {
  request: Request;
  errorTitle: string;
  errorMessage?: string;
}

export const Error = ({ errorTitle, errorMessage, request }: Props) => {
  return (
    <LegacyPageTemplate user={request.user}>
      <section className="px-5 py-20 bg-grey-950-base ">
        <Heading2>{errorTitle}</Heading2>
        <p>{errorMessage}</p>
      </section>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(Error);

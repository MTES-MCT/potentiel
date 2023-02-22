import type { Request } from 'express';
import React from 'react';
import { Heading2, PageTemplate } from '@components';
import { hydrateOnClient } from '../helpers';

interface Props {
  request: Request;
  errorTitle: string;
  errorMessage?: string;
}

export const Error = ({ errorTitle, errorMessage, request }: Props) => {
  return (
    <PageTemplate user={request.user}>
      <main role="main">
        <section className="section section-grey pt-10">
          <div className="container">
            <Heading2>{errorTitle}</Heading2>
            <p>{errorMessage}</p>
          </div>
        </section>
      </main>
    </PageTemplate>
  );
};

hydrateOnClient(Error);

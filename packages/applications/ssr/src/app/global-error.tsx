'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

import { DefaultError } from './error/DefaultError';

type GlobalErrorProps = {
  error: Error & { digest?: string };
};
export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <Notice
          severity="warning"
          title="Erreur dans l'application"
          className="mb-6"
          description={<DefaultError />}
        />
      </body>
    </html>
  );
}

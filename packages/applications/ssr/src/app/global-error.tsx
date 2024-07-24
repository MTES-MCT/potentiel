'use client';

import Alert from '@codegouvfr/react-dsfr/Alert';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

import { DefaultError } from '../components/pages/custom-error/DefaultError';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Alert
          severity="warning"
          title="Erreur dans l'application"
          className="mb-6"
          description={<DefaultError />}
        />
      </body>
    </html>
  );
}

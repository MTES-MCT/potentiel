/* eslint-disable no-console */
'use client';

import { captureException } from '@sentry/react';
import { useEffect } from 'react';

// https://nextjs.org/docs/app/api-reference/file-conventions/error

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    // should appear on Sentry side
    console.error(error);
    captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  );
}

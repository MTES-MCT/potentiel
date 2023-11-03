'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DsfrProvider>
      <SessionProvider>{children}</SessionProvider>
    </DsfrProvider>
  );
};

export default Providers;

'use client';

import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DsfrProvider>
      <SessionProvider>{children}</SessionProvider>
    </DsfrProvider>
  );
};

export default Providers;

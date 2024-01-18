'use client';

import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});
  return (
    <DsfrProvider>
      <MuiDsfrThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </MuiDsfrThemeProvider>
    </DsfrProvider>
  );
};

export default Providers;

'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

const Providers = ({ children }: { children: React.ReactNode }) => {
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

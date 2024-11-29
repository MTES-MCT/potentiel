'use client';

import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});
  return (
    <DsfrProvider>
      <MuiDsfrThemeProvider>{children}</MuiDsfrThemeProvider>
    </DsfrProvider>
  );
};

export default Providers;

'use client';

import React from 'react';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';

import { FeatureFlagContext } from '@/utils/feature-flag/FeatureFlagContext';

type ProvidersProps = {
  features: Array<string>;
  children: React.ReactNode;
};

const Providers = ({ children, features }: ProvidersProps) => {
  const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});
  return (
    <DsfrProvider>
      <MuiDsfrThemeProvider>
        <FeatureFlagContext.Provider value={features}>{children}</FeatureFlagContext.Provider>
      </MuiDsfrThemeProvider>
    </DsfrProvider>
  );
};

export default Providers;

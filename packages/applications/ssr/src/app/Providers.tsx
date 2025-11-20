'use client';

import React from 'react';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

import { FeatureFlagContext } from '@/utils/feature-flag/FeatureFlagContext';
import { DsfrProvider } from '@/dsfr-bootstrap';

type ProvidersProps = {
  features: Array<string>;
  children: React.ReactNode;
};

const Providers = ({ children, features }: ProvidersProps) => {
  const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});
  return (
    <DsfrProvider lang="fr">
      <MuiDsfrThemeProvider>
        <FeatureFlagContext.Provider value={features}>{children}</FeatureFlagContext.Provider>
      </MuiDsfrThemeProvider>
    </DsfrProvider>
  );
};

export default Providers;

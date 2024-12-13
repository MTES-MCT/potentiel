type FeatureFlags = {
  isActionnaireEnabled: boolean;
};

export const featureFlags: FeatureFlags = {
  isActionnaireEnabled: process.env.NEXT_PUBLIC_IS_ACTIONNAIRE_ENABLED === 'true',
};

export const isDemandeChangementReprésentantLégalEnabled = () =>
  process.env.NEXT_PUBLIC_IS_DEMANDE_CHANGEMENT_REPRESENTANT_LEGAL_ENABLED === 'true';

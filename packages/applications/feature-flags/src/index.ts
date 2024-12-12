type FeatureFlags = {
  isActionnaireEnabled: boolean;
};

export const featureFlags: FeatureFlags = {
  isActionnaireEnabled: process.env.NEXT_PUBLIC_IS_ACTIONNAIRE_ENABLED === 'true',
};

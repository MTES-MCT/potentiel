type FeatureFlags = {
  isRecoursEnabled: boolean;
};

export const featureFlags: FeatureFlags = {
  isRecoursEnabled: process.env.NEXT_PUBLIC_IS_RECOURS_ENABLED === 'true',
};

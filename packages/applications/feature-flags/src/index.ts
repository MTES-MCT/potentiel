type FeatureFlags = {
  SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES?: true;
};

export const featureFlags: FeatureFlags = {
  ...(process.env.APPLICATION_STAGE !== 'production' && {
    SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES: true,
  }),
};

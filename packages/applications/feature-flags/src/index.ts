type FeatureFlags = {
  SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES?: true;
};

export const featureFlags: FeatureFlags = {
  ...(process.env.APPLICATION_STAGE !== 'local' && {
    SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES: true,
  }),
};

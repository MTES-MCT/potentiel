type FeatureFlags = {
  SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES?: true;
};

export const featureFlags: FeatureFlags = {
  SHOW_MAIN_LEVEE_GARANTIES_FINANCIERES:
    process.env.APPLICATION_STAGE !== 'production' ? true : undefined,
};

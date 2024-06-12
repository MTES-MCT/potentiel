type FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES?: true;
};

export const featureFlags: FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES:
    process.env.APPLICATION_STAGE !== 'production' ? true : undefined,
};

export const showMainlevéeGarantiesFinancières =
  featureFlags.SHOW_MAINLEVEE_GARANTIES_FINANCIERES === true;

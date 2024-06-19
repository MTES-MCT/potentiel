type FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES: boolean;
};

// env variables should be duplicated in both .env.template (and .env obviously) using the prefix NEXT_PUBLIC for the ssr folder
export const featureFlags: FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES:
    process.env.SHOW_MAINLEVEE_GARANTIES_FINANCIERES === 'true' ||
    process.env.NEXT_PUBLIC_SHOW_MAINLEVEE_GARANTIES_FINANCIERES === 'true',
};

export const showMainlevéeGarantiesFinancières = featureFlags.SHOW_MAINLEVEE_GARANTIES_FINANCIERES;

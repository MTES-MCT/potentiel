type FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES: boolean;
};

export const featureFlags: FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES:
    process.env.SHOW_MAINLEVEE_GARANTIES_FINANCIERES === 'true' ||
    process.env.NEXT_PUBLIC_SHOW_MAINLEVEE_GARANTIES_FINANCIERES === 'true',
};

export const showMainlevéeGarantiesFinancières = featureFlags.SHOW_MAINLEVEE_GARANTIES_FINANCIERES;

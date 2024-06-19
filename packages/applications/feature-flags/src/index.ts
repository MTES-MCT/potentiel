type FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES: boolean;
};

/*
env variables should be prefixed by NEXT_PUBLIC and duplicated in both .env.template (and .env obviously)
this enable the var to be used in a browser environment for Next app
doc: nextjs.org/docs/pages/building-your-application/configuring/environment-variables
*/
export const featureFlags: FeatureFlags = {
  SHOW_MAINLEVEE_GARANTIES_FINANCIERES:
    process.env.NEXT_PUBLIC_SHOW_MAINLEVEE_GARANTIES_FINANCIERES === 'true' ||
    process.env.APPLICATION_STAGE === 'test',
};

export const showMainlevéeGarantiesFinancières = featureFlags.SHOW_MAINLEVEE_GARANTIES_FINANCIERES;

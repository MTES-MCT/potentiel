export type ListerIdentifiantsProjetsParPorteurPort = (email: string) => Promise<
  Array<{
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
  }>
>;

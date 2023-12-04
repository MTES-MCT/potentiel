export type ListerIdentifiantsProjetsAccessiblesPort = (email: string) => Promise<
  Array<{
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
  }>
>;

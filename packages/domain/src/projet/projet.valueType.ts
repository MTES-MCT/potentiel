export type IdentifiantProjet = {
  appelOffre: string;
  période: string;
  famille?: string;
  numéroCRE: string;
};

export const formatIdentifiantProjet = ({
  appelOffre,
  période,
  famille = '',
  numéroCRE,
}: IdentifiantProjet): string => {
  return `${appelOffre}#${période}#${famille}#${numéroCRE}`;
};

export const parseIdentifiantProjet = (identifiantProjet: string): IdentifiantProjet => {
  const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

  return {
    appelOffre,
    période,
    famille,
    numéroCRE,
  };
};

export type IdentifiantProjet = {
  appelOffre: string;
  période: string;
  famille?: string;
  numéroCRE: string;
  formatter: () => string;
};

export const convertirEnIdentifiantProjet = (identifiantProjet: string): IdentifiantProjet => {
  const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

  return {
    appelOffre,
    période,
    famille,
    numéroCRE,
    formatter() {
      return `${appelOffre}#${période}#${famille}#${numéroCRE}`;
    },
  };
};

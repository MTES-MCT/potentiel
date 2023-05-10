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
}: IdentifiantProjet): `${string}#${string}#${string}#${string}` => {
  return `${appelOffre}#${période}#${famille}#${numéroCRE}`;
};

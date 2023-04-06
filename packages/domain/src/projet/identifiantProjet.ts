export type IdentifiantProjet = {
  appelOffre: string;
  période: string;
  famille?: string;
  numéroCRE: string;
};

const format = ({
  appelOffre,
  numéroCRE,
  période,
  famille = '',
}: IdentifiantProjet): `${string}#${string}#${string}#${string}` => {
  return `${appelOffre}#${période}#${famille}#${numéroCRE}`;
};

export const identifiantProjet = {
  format,
};

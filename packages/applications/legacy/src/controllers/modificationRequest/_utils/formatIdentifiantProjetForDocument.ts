import { IdentifiantProjet } from '@potentiel-domain/common';

export const formatIdentifiantProjetForDocument = ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType): string =>
  `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;

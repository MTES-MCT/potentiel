import { IdentifiantProjet } from '@potentiel-domain/projet';

export const formatIdentifiantProjetForDocument = ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType): string =>
  `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;

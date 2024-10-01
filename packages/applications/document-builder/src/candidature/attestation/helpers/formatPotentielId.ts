import { IdentifiantProjet } from '@potentiel-domain/common';

export const formatPotentielId = (identifiantProjet: IdentifiantProjet.ValueType): string => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};

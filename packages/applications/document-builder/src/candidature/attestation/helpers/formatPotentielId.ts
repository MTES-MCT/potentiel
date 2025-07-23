import { IdentifiantProjet } from '@potentiel-domain/projet';

export const formatPotentielId = (identifiantProjet: IdentifiantProjet.ValueType): string => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};

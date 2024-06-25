import { IdentifiantProjet } from '@potentiel-domain/common';

export const formatIdentifiantProjetForDocument = (identifiantProjet: string): string => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};

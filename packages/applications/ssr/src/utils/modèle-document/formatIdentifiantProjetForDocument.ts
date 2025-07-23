import { IdentifiantProjet } from '@potentiel-domain/projet';

export const formatIdentifiantProjetForDocument = (identifiantProjet: string): string => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};

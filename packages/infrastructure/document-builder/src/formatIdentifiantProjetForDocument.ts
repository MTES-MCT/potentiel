import { IdentifiantProjet } from '@potentiel-domain/common';

export const formatIdentifiantProjetForDocument = (projectId: string): string => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(projectId);

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};

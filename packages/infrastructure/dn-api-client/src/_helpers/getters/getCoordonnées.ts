import { Candidature } from '@potentiel-domain/projet';

import type { DossierAccessor } from '../../graphql/index.js';

type GetCoordonnéesProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampLatitude: keyof TDossier;
  nomChampLongitude: keyof TDossier;
};
export const getCoordonnées = <TDossier extends Record<string, string>>({
  accessor,
  nomChampLatitude,
  nomChampLongitude,
}: GetCoordonnéesProps<TDossier>) => {
  const latitude = accessor.getStringValue(nomChampLatitude);
  const longitude = accessor.getStringValue(nomChampLongitude);

  if (latitude && longitude) {
    try {
      return Candidature.Coordonnées.bind({
        latitude: Number(latitude),
        longitude: Number(longitude),
      }).formatterDecimal();
    } catch {}
  }
};

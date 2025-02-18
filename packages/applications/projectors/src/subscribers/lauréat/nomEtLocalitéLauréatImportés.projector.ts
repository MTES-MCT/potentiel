import { Lauréat } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../infrastructure';

export const nomEtLocalitéLauréatImportésProjector = async ({
  payload: { identifiantProjet, nomProjet, localité },
}: Lauréat.NomEtLocalitéLauréatImportésEvent) =>
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
  });

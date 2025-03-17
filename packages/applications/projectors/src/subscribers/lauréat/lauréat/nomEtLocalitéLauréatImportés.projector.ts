import { Lauréat } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const nomEtLocalitéLauréatImportésProjector = async ({
  payload: { identifiantProjet, nomProjet, localité },
}: Lauréat.NomEtLocalitéLauréatImportésEvent) =>
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
  });

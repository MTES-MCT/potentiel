import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const nomEtLocalitéLauréatImportésProjector = async ({
  payload: { identifiantProjet, nomProjet, localité, coordonnées },
}: Lauréat.NomEtLocalitéLauréatImportésEvent) =>
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
    coordonnées,
  });

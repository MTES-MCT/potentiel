import { Lauréat } from '@potentiel-domain/laureat';

import { updateOneProjection, upsertProjection } from '../../infrastructure';

export const lauréatNotifiéV1Projector = async ({
  payload: { identifiantProjet, notifiéLe, notifiéPar },
}: Lauréat.LauréatNotifiéV1Event) =>
  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    identifiantProjet,
    notifiéLe,
    notifiéPar,

    // Ces valeurs manquantes sont systématiquements surchargées par NomEtLocalitéLauréatImportés
    nomProjet: '!! VALEUR MANQUANTE !!',
    localité: {
      adresse1: '!! VALEUR MANQUANTE !!',
      adresse2: '!! VALEUR MANQUANTE !!',
      codePostal: '!! VALEUR MANQUANTE !!',
      commune: '!! VALEUR MANQUANTE !!',
      département: '!! VALEUR MANQUANTE !!',
      région: '!! VALEUR MANQUANTE !!',
    },
  });

export const nomEtLocalitéLauréatImportésProjector = async ({
  payload: { identifiantProjet, nomProjet, localité },
}: Lauréat.NomEtLocalitéLauréatImportésEvent) =>
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
  });

export const lauréatNotifiéProjector = async ({
  payload: { identifiantProjet, notifiéLe, notifiéPar, nomProjet, localité },
}: Lauréat.LauréatNotifiéEvent) =>
  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    nomProjet,
    localité,
  });

import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const lauréatNotifiéV1Projector = async ({
  payload: { identifiantProjet, notifiéLe, notifiéPar },
}: Lauréat.LauréatNotifiéV1Event) => {
  const { appelOffre, période, famille } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    identifiantProjet,
    appelOffre,
    période,
    famille,
    notifiéLe,
    notifiéPar,
    cahierDesCharges: 'initial',
    statut: Lauréat.StatutLauréat.actif.statut,

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
};

export const lauréatNotifiéProjector = async ({
  payload: { identifiantProjet, notifiéLe, notifiéPar, nomProjet, localité },
}: Lauréat.LauréatNotifiéEvent) => {
  const { appelOffre, période, famille } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    identifiantProjet,
    appelOffre,
    période,
    famille,
    notifiéLe,
    notifiéPar,
    nomProjet,
    localité,
    cahierDesCharges: 'initial',
    statut: Lauréat.StatutLauréat.actif.statut,
  });
};

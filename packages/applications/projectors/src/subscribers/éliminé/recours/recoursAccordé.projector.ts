import { Where } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const recoursAccordéProjector = async ({
  type,
  payload,
}: Éliminé.Recours.RecoursAccordéV1Event | Éliminé.Recours.RecoursAccordéEvent) => {
  await updateManyProjections<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours`,
    {
      identifiantProjet: Where.equal(payload.identifiantProjet),
      statut: Where.matchAny(Éliminé.Recours.StatutRecours.statutsEnCours),
    },
    {
      demande: {
        accord: {
          accordéLe: payload.accordéLe,
          accordéPar: payload.accordéPar,
          réponseSignée: payload.réponseSignée,
          ...(type === 'RecoursAccordé-V2' && {
            dateRéponseSignée: payload.dateRéponseSignée,
          }),
        },
      },
      statut: Éliminé.Recours.StatutRecours.accordé.statut,
      miseÀJourLe: payload.accordéLe,
    },
  );

  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${payload.identifiantProjet}`, {
    identifiantProjet: payload.identifiantProjet,
    dernièreDemande: { statut: Éliminé.Recours.StatutRecours.accordé.statut },
  });
};

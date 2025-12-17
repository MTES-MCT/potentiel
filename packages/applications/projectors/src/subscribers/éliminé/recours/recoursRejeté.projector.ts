import { Where } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const recoursRejetéProjector = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: Éliminé.Recours.RecoursRejetéEvent) => {
  await updateManyProjections<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Éliminé.Recours.StatutRecours.statutsEnCours),
    },
    {
      demande: {
        rejet: {
          rejetéLe,
          rejetéPar,
          réponseSignée: {
            format,
          },
        },
      },
      statut: Éliminé.Recours.StatutRecours.rejeté.value,
      miseÀJourLe: rejetéLe,
    },
  );
  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    dernièreDemande: { statut: Éliminé.Recours.StatutRecours.rejeté.value },
  });
};

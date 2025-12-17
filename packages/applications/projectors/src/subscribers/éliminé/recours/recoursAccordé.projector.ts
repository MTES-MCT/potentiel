import { Where } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const recoursAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Éliminé.Recours.RecoursAccordéEvent) => {
  await updateManyProjections<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Éliminé.Recours.StatutRecours.statutsEnCours),
    },
    {
      demande: {
        accord: {
          accordéLe,
          accordéPar,
          réponseSignée: {
            format,
          },
        },
      },
      statut: Éliminé.Recours.StatutRecours.accordé.value,
      miseÀJourLe: accordéLe,
    },
  );

  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    dernièreDemande: { statut: Éliminé.Recours.StatutRecours.accordé.value },
  });
};

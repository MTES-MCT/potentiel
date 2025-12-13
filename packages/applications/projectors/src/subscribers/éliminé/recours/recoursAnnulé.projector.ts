import { Where } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const recoursAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe, annuléPar },
}: Éliminé.Recours.RecoursAnnuléEvent) => {
  await updateManyProjections<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Éliminé.Recours.StatutRecours.statutsEnCours),
    },
    {
      demande: {
        annulation: { annuléLe, annuléPar },
      },
      statut: Éliminé.Recours.StatutRecours.annulé.value,
      miseÀJourLe: annuléLe,
    },
  );

  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    dernièreDemande: { statut: Éliminé.Recours.StatutRecours.annulé.value },
  });
};

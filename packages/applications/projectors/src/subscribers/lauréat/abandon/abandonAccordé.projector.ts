import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const abandonAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Lauréat.Abandon.AbandonAccordéEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    estAbandonné: true,
    dernièreDemande: { statut: 'accordé' },
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        accord: {
          accordéLe,
          accordéPar,
          réponseSignée: {
            format: réponseSignée.format,
          },
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.accordé.statut,
      miseÀJourLe: accordéLe,
    },
  );
};

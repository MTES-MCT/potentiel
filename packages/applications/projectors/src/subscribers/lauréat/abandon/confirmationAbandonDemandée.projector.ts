import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const confirmationAbandonDemandéeProjector = async ({
  payload: { identifiantProjet, confirmationDemandéeLe, confirmationDemandéePar, réponseSignée },
}: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    dernièreDemande: { statut: 'confirmation-demandée' },
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        confirmation: {
          demandéeLe: confirmationDemandéeLe,
          demandéePar: confirmationDemandéePar,
          réponseSignée: {
            format: réponseSignée.format,
          },
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.confirmationDemandée.statut,
      miseÀJourLe: confirmationDemandéeLe,
    },
  );
};

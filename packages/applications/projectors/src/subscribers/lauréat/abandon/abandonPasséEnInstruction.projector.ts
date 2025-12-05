import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const abandonPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Lauréat.Abandon.AbandonPasséEnInstructionEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    dernièreDemande: { statut: 'en-instruction' },
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        instruction: {
          passéEnInstructionLe,
          passéEnInstructionPar,
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.enInstruction.statut,
      miseÀJourLe: passéEnInstructionLe,
    },
  );
};

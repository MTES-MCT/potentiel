import { Where } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';
import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';

export const recoursPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Éliminé.Recours.RecoursPasséEnInstructionEvent) => {
  await updateManyProjections<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Éliminé.Recours.StatutRecours.statutsEnCours),
    },
    {
      demande: {
        instruction: {
          passéEnInstructionLe,
          passéEnInstructionPar,
        },
      },
      statut: Éliminé.Recours.StatutRecours.enInstruction.value,
      miseÀJourLe: passéEnInstructionLe,
    },
  );
};

import { Lauréat } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

export const mapToRecoursPasséEnInstructionTimelineItemProp = (
  recoursPasséEnInstruction: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    recoursPasséEnInstruction.payload as Éliminé.Recours.RecoursPasséEnInstructionEvent['payload'];

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        Demande de recours passée en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};

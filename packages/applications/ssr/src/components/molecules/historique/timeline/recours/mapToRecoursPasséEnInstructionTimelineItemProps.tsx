import { Historique } from '@potentiel-domain/historique';
import { Recours } from '@potentiel-domain/elimine';

export const mapToRecoursPasséEnInstructionTimelineItemProp = (
  recoursPasséEnInstruction: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    recoursPasséEnInstruction.payload as Recours.RecoursPasséEnInstructionEvent['payload'];

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

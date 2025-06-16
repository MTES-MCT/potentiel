import { Éliminé } from '@potentiel-domain/projet';

import { MapToRecoursTimelineItemProps } from '../mapToRecoursTimelineItemProps';

export const mapToRecoursPasséEnInstructionTimelineItemProp: MapToRecoursTimelineItemProps = (
  recoursPasséEnInstruction,
  icon,
) => {
  const { passéEnInstructionLe, passéEnInstructionPar } =
    recoursPasséEnInstruction.payload as Éliminé.Recours.RecoursPasséEnInstructionEvent['payload'];

  return {
    date: passéEnInstructionLe,
    icon,
    title: (
      <div>
        Demande de recours passée en instruction par{' '}
        {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};

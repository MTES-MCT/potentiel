import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDemandeDélaiPasséeEnInstructionTimelineItemProps = (
  event:
    | Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent
    | Lauréat.Délai.DemandeDélaiPasséeEnInstructionEventV1,
): TimelineItemProps => {
  const { passéeEnInstructionLe, passéeEnInstructionPar } = event.payload;

  const motif = getMotifDemandeDélaiLabel(
    event.type === 'DemandeDélaiPasséeEnInstruction-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter()
      : event.payload.motifDemande,
  );

  return {
    date: passéeEnInstructionLe,
    title: 'Demande de délai passée en instruction',
    actor: passéeEnInstructionPar,
    details: (
      <div>
        Motif de la demande : <span className="font-semibold">{motif.toLowerCase()}</span>
      </div>
    ),
  };
};

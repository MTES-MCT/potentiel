import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursRejetéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
  mapToRecoursDemandéHistoriqueGlobalTimelineItemProps,
} from './events';

export const mapToRecoursHistoriqueGlobalTimelineItemProps = (
  event: Éliminé.Recours.HistoriqueRecoursProjetListItemReadModel,
) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'RecoursDemandé-V1',
      },
      mapToRecoursDemandéHistoriqueGlobalTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursAnnulé-V1',
      },
      mapToRecoursAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursAccordé-V1',
      },
      mapToRecoursAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursRejeté-V1',
      },
      mapToRecoursRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursPasséEnInstruction-V1',
      },
      mapToRecoursPasséEnInstructionTimelineItemProp,
    )
    .exhaustive();

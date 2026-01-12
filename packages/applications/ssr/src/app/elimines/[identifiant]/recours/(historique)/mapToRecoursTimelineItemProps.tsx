import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToRecoursDemandéTimelineItemProps,
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursRejetéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
} from './events';

export const mapToRecoursTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Éliminé.Recours.HistoriqueRecoursProjetListItemReadModel;
  isHistoriqueProjet?: true;
}) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'RecoursDemandé-V1',
      },
      (event) => mapToRecoursDemandéTimelineItemProps({ event, isHistoriqueProjet }),
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

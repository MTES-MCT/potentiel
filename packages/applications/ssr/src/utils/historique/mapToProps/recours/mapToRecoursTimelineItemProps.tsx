import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { recoursIcon } from '../icons';

import {
  mapToRecoursDemandéTimelineItemProps,
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursRejetéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
} from './events';

export type MapToRecoursTimelineItemProps = (
  readmodel: Historique.HistoriqueRecoursProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToRecoursTimelineItemProps = (
  record: Historique.HistoriqueRecoursProjetListItemReadModel,
) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'RecoursDemandé-V1',
      },
      (event) => mapToRecoursDemandéTimelineItemProps(event, recoursIcon),
    )
    .with(
      {
        type: 'RecoursAnnulé-V1',
      },
      (event) => mapToRecoursAnnuléTimelineItemProps(event, recoursIcon),
    )
    .with(
      {
        type: 'RecoursAccordé-V1',
      },
      (event) => mapToRecoursAccordéTimelineItemProps(event, recoursIcon),
    )
    .with(
      {
        type: 'RecoursRejeté-V1',
      },
      (event) => mapToRecoursRejetéTimelineItemProps(event, recoursIcon),
    )
    .with(
      {
        type: 'RecoursPasséEnInstruction-V1',
      },
      (event) => mapToRecoursPasséEnInstructionTimelineItemProp(event, recoursIcon),
    )
    .exhaustive();

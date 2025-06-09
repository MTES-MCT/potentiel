import { match, P } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToAbandonAccordéTimelineItemProps,
  mapToAbandonAnnuléTimelineItemProps,
  mapToAbandonConfirméTimelineItemProps,
  mapToAbandonDemandéTimelineItemProps,
  mapToAbandonRejetéTimelineItemProps,
  mapToConfirmationAbandonDemandéeTimelineItemProps,
  mapToPreuveRecandidatureDemandéeTimelineItemProps,
  mapToPreuveRecandidatureTransmiseTimelineItemProps,
} from './events';
import { mapToAbandonPasséEnInstructionTimelineItemProps } from './events/mapToAbandonPasséEnInstructionTimelineItemProps';

export const mapToAbandonTimelineItemProps = (record: Historique.AbandonHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: P.union('AbandonDemandé-V1', 'AbandonDemandé-V2'),
      },
      mapToAbandonDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'AbandonAnnulé-V1',
      },
      mapToAbandonAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'ConfirmationAbandonDemandée-V1',
      },
      mapToConfirmationAbandonDemandéeTimelineItemProps,
    )
    .with(
      {
        type: 'AbandonConfirmé-V1',
      },
      mapToAbandonConfirméTimelineItemProps,
    )
    .with(
      {
        type: 'AbandonAccordé-V1',
      },
      mapToAbandonAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'AbandonRejeté-V1',
      },
      mapToAbandonRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureDemandée-V1',
      },
      mapToPreuveRecandidatureDemandéeTimelineItemProps,
    )
    .with(
      {
        type: 'PreuveRecandidatureTransmise-V1',
      },
      mapToPreuveRecandidatureTransmiseTimelineItemProps,
    )
    .with(
      {
        type: 'AbandonPasséEnInstruction-V1',
      },
      mapToAbandonPasséEnInstructionTimelineItemProps,
    )
    .exhaustive();

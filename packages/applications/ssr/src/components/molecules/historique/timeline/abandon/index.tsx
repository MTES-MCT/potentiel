import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Abandon } from '@potentiel-domain/laureat';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAbandonDemandéTimelineItemProps } from './mapToAbandonDemandéTimelineItemProps';
import { mapToAbandonAnnuléTimelineItemProps } from './mapToAbandonAnnuléTimelineItemProps';
import { mapToAbandonRejetéTimelineItemProps } from './mapToAbandonRejetéTimelineItemProps';
import { mapToPreuveRecandidatureDemandéeTimelineItemProps } from './mapToPreuveRecandidatureDemandéeTimelineItemProps';
import { mapToAbandonConfirméTimelineItemProps } from './mapToAbandonConfirméTimelineItemProps';
import { mapToAbandonAccordéTimelineItemProps } from './mapToAbandonAccordéTimelineItemProps';
import { mapToConfirmationAbandonDemandéeTimelineItemProps } from './mapToConfirmationAbandonDemandéeTimelineItemProps';
import { mapToPreuveRecandidatureTransmiseTimelineItemProps } from './mapToPreuveRecandidatureTransmiseTimelineItemProps';
import { mapToAbandonPasséEnInstructionTimelineItemProps } from './mapToAbandonPasséEnInstructionTimelineItemProps';

export type AbandonHistoryRecord = HistoryRecord<Abandon.AbandonEvent['payload']> & {
  type: Abandon.AbandonEvent['type'];
  category: 'abandon';
};

export const mapToAbandonTimelineItemProps = (record: AbandonHistoryRecord) =>
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

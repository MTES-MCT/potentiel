import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
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

export const mapToAbandonTimelineItemProps = (
  readmodel: Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel,
) =>
  match(readmodel)
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

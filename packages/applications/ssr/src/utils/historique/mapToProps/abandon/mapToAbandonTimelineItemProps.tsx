import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { demandeIcon } from '../icons';

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
      (event) => mapToAbandonDemandéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'AbandonAnnulé-V1',
      },
      (event) => mapToAbandonAnnuléTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ConfirmationAbandonDemandée-V1',
      },
      (event) => mapToConfirmationAbandonDemandéeTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'AbandonConfirmé-V1',
      },
      (event) => mapToAbandonConfirméTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'AbandonAccordé-V1',
      },
      (event) => mapToAbandonAccordéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'AbandonRejeté-V1',
      },
      (event) => mapToAbandonRejetéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'PreuveRecandidatureDemandée-V1',
      },
      (event) => mapToPreuveRecandidatureDemandéeTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'PreuveRecandidatureTransmise-V1',
      },
      (event) => mapToPreuveRecandidatureTransmiseTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'AbandonPasséEnInstruction-V1',
      },
      (event) => mapToAbandonPasséEnInstructionTimelineItemProps(event, demandeIcon),
    )
    .exhaustive();

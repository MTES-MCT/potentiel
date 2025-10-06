import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { HistoriqueItem } from '../../HistoriqueItem.type';

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

export const mapToAbandonTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel
> = ({ event, withLink }) =>
  match(event)
    .with(
      {
        type: P.union('AbandonDemandé-V1', 'AbandonDemandé-V2'),
      },
      (event) => mapToAbandonDemandéTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AbandonAnnulé-V1',
      },
      (event) => mapToAbandonAnnuléTimelineItemProps({ event }),
    )
    .with(
      {
        type: 'ConfirmationAbandonDemandée-V1',
      },
      (event) => mapToConfirmationAbandonDemandéeTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AbandonConfirmé-V1',
      },
      (event) => mapToAbandonConfirméTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AbandonAccordé-V1',
      },
      (event) => mapToAbandonAccordéTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AbandonRejeté-V1',
      },
      (event) => mapToAbandonRejetéTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'PreuveRecandidatureDemandée-V1',
      },
      (event) => mapToPreuveRecandidatureDemandéeTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'PreuveRecandidatureTransmise-V1',
      },
      (event) => mapToPreuveRecandidatureTransmiseTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AbandonPasséEnInstruction-V1',
      },
      (event) => mapToAbandonPasséEnInstructionTimelineItemProps({ event, withLink }),
    )
    .exhaustive();

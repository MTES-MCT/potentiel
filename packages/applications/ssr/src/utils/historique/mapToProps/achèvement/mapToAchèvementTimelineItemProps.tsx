import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToAttestationConformitéModifiéeTimelineItemProps,
  mapToAttestationConformitéTransmiseTimelineItemProps,
} from './events';

export const mapToAchèvementTimelineItemProps = (
  readmodel: Lauréat.HistoriqueAchèvementProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with(
      {
        type: 'AttestationConformitéModifiée-V1',
      },
      mapToAttestationConformitéModifiéeTimelineItemProps,
    )
    .with(
      {
        type: 'AttestationConformitéTransmise-V1',
      },
      mapToAttestationConformitéTransmiseTimelineItemProps,
    )
    .with(
      {
        type: 'DatePrévisionnelleCalculée-V1',
      },
      () => undefined,
    )
    .exhaustive();

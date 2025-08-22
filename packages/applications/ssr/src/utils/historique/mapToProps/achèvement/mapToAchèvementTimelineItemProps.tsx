import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import {
  mapToAttestationConformitéModifiéeTimelineItemProps,
  mapToAttestationConformitéTransmiseTimelineItemProps,
  mapToDateAchèvementPrévisionnelCalculéeProps,
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
        type: 'DateAchèvementPrévisionnelCalculée-V1',
      },
      mapToDateAchèvementPrévisionnelCalculéeProps,
    )
    .exhaustive();

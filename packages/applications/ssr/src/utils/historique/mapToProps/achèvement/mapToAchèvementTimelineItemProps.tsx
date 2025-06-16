import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { achèvementIcon } from '../icons';

import { mapToAttestationConformitéTransmiseTimelineItemProps } from './events/mapToAttestationConformitéTransmiseTimelineItemProps';

export type MapToAchèvementTimelineItemProps = (
  readmodel: Historique.HistoriqueAchèvementProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToAchèvementTimelineItemProps = (
  readmodel: Historique.HistoriqueAchèvementProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps | undefined>()
    .with(
      {
        type: 'AttestationConformitéModifiée-V1',
      },
      () => undefined,
    )
    .with(
      {
        type: 'AttestationConformitéTransmise-V1',
      },
      (event) => mapToAttestationConformitéTransmiseTimelineItemProps(event, achèvementIcon),
    )
    .exhaustive();

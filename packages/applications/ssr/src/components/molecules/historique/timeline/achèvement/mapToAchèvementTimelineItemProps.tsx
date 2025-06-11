import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAttestationConformitéTransmiseTimelineItemProps } from './events/mapToAttestationConformitéTransmiseTimelineItemProps';

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
      mapToAttestationConformitéTransmiseTimelineItemProps,
    )
    .exhaustive();

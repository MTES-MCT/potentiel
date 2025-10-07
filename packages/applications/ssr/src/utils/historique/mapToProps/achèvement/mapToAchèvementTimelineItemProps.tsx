import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { HistoriqueItem } from '../../HistoriqueItem.type';

import {
  mapToAttestationConformitéModifiéeTimelineItemProps,
  mapToAttestationConformitéTransmiseTimelineItemProps,
  mapToDateAchèvementPrévisionnelCalculéeProps,
} from './events';

export const mapToAchèvementTimelineItemProps: HistoriqueItem<
  Lauréat.HistoriqueAchèvementProjetListItemReadModel
> = ({ event, withLink }) =>
  match(event)
    .with(
      {
        type: 'AttestationConformitéModifiée-V1',
      },
      (event) => mapToAttestationConformitéModifiéeTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'AttestationConformitéTransmise-V1',
      },
      (event) => mapToAttestationConformitéTransmiseTimelineItemProps({ event, withLink }),
    )
    .with(
      {
        type: 'DateAchèvementPrévisionnelCalculée-V1',
      },
      (event) => mapToDateAchèvementPrévisionnelCalculéeProps({ event, withLink }),
    )
    .exhaustive();

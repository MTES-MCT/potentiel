import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import {
  mapToAchèvementModifiéTimelineItemProps,
  mapToAttestationConformitéTransmiseTimelineItemProps,
  mapToDateAchèvementPrévisionnelCalculéeProps,
  mapToDateAchèvementTransmiseTimelineItemProps,
} from './events';
import { mapToAttestationConformitéEnregistréeTimelineItemProps } from './events/mapToAttestationConformitéEnregistréeTimelineItemProps';
import { mapToAttestationConformitéModifiéeTimelineItemProps } from './events/mapToAttestationConformitéModifiéeTimelineItemProps';

type MapToAchèvementTimelineItemProps = (
  readmodel: Lauréat.HistoriqueAchèvementProjetListItemReadModel,
) => TimelineItemProps;

export const mapToAchèvementTimelineItemProps: MapToAchèvementTimelineItemProps = (readmodel) =>
  match(readmodel)
    .with({ type: 'DateAchèvementTransmise-V1' }, mapToDateAchèvementTransmiseTimelineItemProps)
    .with(
      { type: P.union('AttestationConformitéTransmise-V1', 'AttestationConformitéTransmise-V2') },
      mapToAttestationConformitéTransmiseTimelineItemProps,
    )
    .with(
      { type: P.union('AttestationConformitéModifiée-V1', 'AttestationConformitéModifiée-V2') },
      mapToAttestationConformitéModifiéeTimelineItemProps,
    )
    .with(
      {
        type: P.union('AttestationConformitéEnregistrée-V1', 'AttestationConformitéEnregistrée-V2'),
      },
      mapToAttestationConformitéEnregistréeTimelineItemProps,
    )
    .with(
      { type: P.union('AchèvementModifié-V1', 'AchèvementModifié-V2') },
      mapToAchèvementModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'DateAchèvementPrévisionnelCalculée-V1',
        payload: {
          raison: P.union(
            'notification',
            'délai-accordé',
            'covid',
            'ajout-délai-cdc-30_08_2022',
            'retrait-délai-cdc-30_08_2022',
          ),
        },
      },
      mapToDateAchèvementPrévisionnelCalculéeProps,
    )
    .with(
      {
        type: 'DateAchèvementPrévisionnelCalculée-V1',
        payload: {
          raison: 'inconnue',
        },
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

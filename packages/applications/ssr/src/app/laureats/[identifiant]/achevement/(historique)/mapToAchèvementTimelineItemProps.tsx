import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

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
      { type: 'AttestationConformitéTransmise-V1' },
      mapToAttestationConformitéTransmiseTimelineItemProps,
    )
    .with(
      { type: 'AttestationConformitéModifiée-V1' },
      mapToAttestationConformitéModifiéeTimelineItemProps,
    )
    .with(
      { type: 'AttestationConformitéEnregistrée-V1' },
      mapToAttestationConformitéEnregistréeTimelineItemProps,
    )
    .with({ type: 'AchèvementModifié-V1' }, mapToAchèvementModifiéTimelineItemProps)
    .with(
      {
        type: 'DateAchèvementPrévisionnelCalculée-V1',
        payload: {
          raison: P.union('ajout-délai-cdc-30_08_2022', 'retrait-délai-cdc-30_08_2022', 'covid'),
        },
      },
      mapToDateAchèvementPrévisionnelCalculéeProps,
    )
    .with(
      {
        type: 'DateAchèvementPrévisionnelCalculée-V1',
        payload: {
          raison: P.union('inconnue', 'délai-accordé', 'notification'),
        },
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

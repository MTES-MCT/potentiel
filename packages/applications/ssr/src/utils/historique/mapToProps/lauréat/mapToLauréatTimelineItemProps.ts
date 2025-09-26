import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';
import { mapToNomProjetModifiéTimelineItemProps } from './events/mapToLauréatModifiéTimelineItemProps';
import { mapToSiteDeProductionModifiéTimelineItemProps } from './events/mapToSiteDeProductionModifiéTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<'lauréat', Lauréat.LauréatEvent>;

export const mapToLauréatTimelineItemProps = (
  record: LauréatHistoryRecord,
  aUnRecoursAccordé: boolean,
) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: P.union('NomEtLocalitéLauréatImportés-V1'),
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .with(
      {
        type: P.union('LauréatNotifié-V1', 'LauréatNotifié-V2'),
      },
      (event) => mapToLauréatNotifiéTimelineItemProps(event, aUnRecoursAccordé),
    )
    .with(
      {
        type: 'CahierDesChargesChoisi-V1',
      },
      mapToLauréatCahierDesChargesChoisiTimelineItemProps,
    )
    .with(
      {
        type: 'NomProjetModifié-V1',
      },
      mapToNomProjetModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'SiteDeProductionModifié-V1',
      },
      mapToSiteDeProductionModifiéTimelineItemProps,
    )
    .exhaustive();

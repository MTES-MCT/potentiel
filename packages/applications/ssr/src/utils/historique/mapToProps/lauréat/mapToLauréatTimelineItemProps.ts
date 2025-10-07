import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline/TimelineItem';

import { mapToÉtapeIgnoréeTimelineItemProps } from '../mapToÉtapeIgnoréeTimelineItemProps';

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
        type: 'NomEtLocalitéLauréatImportés-V1',
      },
      (event) => mapToÉtapeIgnoréeTimelineItemProps({ event }),
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

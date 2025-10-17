import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';
import { mapToNomProjetModifiéTimelineItemProps } from './events/mapToLauréatModifiéTimelineItemProps';
import { mapToSiteDeProductionModifiéTimelineItemProps } from './events/mapToSiteDeProductionModifiéTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<'lauréat', Lauréat.LauréatEvent>;

type MapToLauréatTimelineItemProps = {
  readmodel: LauréatHistoryRecord;
  doitAfficherLienAttestationDésignation: boolean;
};

export const mapToLauréatTimelineItemProps = ({
  readmodel,
  doitAfficherLienAttestationDésignation,
}: MapToLauréatTimelineItemProps) =>
  match(readmodel)
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
      (event) =>
        mapToLauréatNotifiéTimelineItemProps(event, doitAfficherLienAttestationDésignation),
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

import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';
import { mapToSiteDeProductionModifiéTimelineItemProps } from './events/mapToSiteDeProductionModifiéTimelineItemProps';
import { mapToChangementNomProjetEnregistréTimelineItemProps } from './events/mapToChangementNomProjetEnregistréTimelineItemProps';
import { mapToNomProjetModifiéTimelineItemProps } from './events/mapToNomProjetModifiéTimelineItemProps';
import { mapToPPASignaléTimelineItemProps } from './events/mapPPASignaléTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<'lauréat', Lauréat.LauréatEvent>;

type MapToLauréatTimelineItemProps = (args: {
  readmodel: LauréatHistoryRecord;
  doitAfficherLienAttestationDésignation: boolean;
}) => TimelineItemProps;

export const mapToLauréatTimelineItemProps: MapToLauréatTimelineItemProps = ({
  readmodel,
  doitAfficherLienAttestationDésignation,
}) =>
  match(readmodel)
    .with(
      {
        type: P.union('NomEtLocalitéLauréatImportés-V1', 'StatutLauréatModifié-V1'),
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
        type: 'ChangementNomProjetEnregistré-V1',
      },
      mapToChangementNomProjetEnregistréTimelineItemProps,
    )
    .with(
      {
        type: 'SiteDeProductionModifié-V1',
      },
      mapToSiteDeProductionModifiéTimelineItemProps,
    )
    .with({ type: 'PPASignalé-V1' }, mapToPPASignaléTimelineItemProps)
    .exhaustive();

import { match, P } from 'ts-pattern';

import type { HistoryRecord } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToChangementNomProjetEnregistréTimelineItemProps } from './events/mapToChangementNomProjetEnregistréTimelineItemProps';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';
import { mapToNomProjetModifiéTimelineItemProps } from './events/mapToNomProjetModifiéTimelineItemProps';
import { mapToSiteDeProductionModifiéTimelineItemProps } from './events/mapToSiteDeProductionModifiéTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<'lauréat', Lauréat.LauréatEvent>;

type MapToLauréatTimelineItemProps = (args: {
  readmodel: LauréatHistoryRecord;
  doitAfficherLienAttestationDésignation: boolean;
  permissionConsulterChangementNom: boolean;
}) => TimelineItemProps;

export const mapToLauréatTimelineItemProps: MapToLauréatTimelineItemProps = ({
  readmodel,
  doitAfficherLienAttestationDésignation,
  permissionConsulterChangementNom,
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
      (event) =>
        mapToChangementNomProjetEnregistréTimelineItemProps(
          event,
          permissionConsulterChangementNom,
        ),
    )
    .with(
      {
        type: 'SiteDeProductionModifié-V1',
      },
      mapToSiteDeProductionModifiéTimelineItemProps,
    )
    .exhaustive();

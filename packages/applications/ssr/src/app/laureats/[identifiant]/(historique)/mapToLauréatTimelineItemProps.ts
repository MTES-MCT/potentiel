import { match, P } from 'ts-pattern';

import type { HistoryRecord } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

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
  rôleUtilisateur: Utilisateur.ValueType['rôle'];
}) => TimelineItemProps;

export const mapToLauréatTimelineItemProps: MapToLauréatTimelineItemProps = ({
  readmodel,
  doitAfficherLienAttestationDésignation,
  rôleUtilisateur,
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
      (event) => mapToChangementNomProjetEnregistréTimelineItemProps(event, rôleUtilisateur),
    )
    .with(
      {
        type: 'SiteDeProductionModifié-V1',
      },
      mapToSiteDeProductionModifiéTimelineItemProps,
    )
    .exhaustive();

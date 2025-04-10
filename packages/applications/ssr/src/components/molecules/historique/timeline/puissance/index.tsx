import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Puissance } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToChangementPuissanceDemandéTimelineItemProps } from './mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './mapToPuissanceModifiéeTimelineItemsProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './mapToChangementPuissanceRejetéTimelineItemProps';
import { mapToChangementPuissanceAnnuléTimelineItemProps } from './mapToChangementPuissanceAnnuléTimelineItemProps';

export type PuissanceHistoryRecord = HistoryRecord<
  'puissance',
  Puissance.PuissanceEvent['type'],
  Puissance.PuissanceEvent['payload']
> & {
  unitePuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
};

export const mapToPuissanceTimelineItemProps = (record: PuissanceHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'PuissanceImportée-V1' }, mapToPuissanceImportéeTimelineItemsProps)
    .with({ type: 'PuissanceModifiée-V1' }, mapToPuissanceModifiéeTimelineItemsProps)
    .with(
      {
        type: 'ChangementPuissanceDemandé-V1',
      },
      mapToChangementPuissanceDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementPuissanceAnnulé-V1',
      },
      mapToChangementPuissanceAnnuléTimelineItemProps,
    )
    .with(
      { type: 'ChangementPuissanceEnregistré-V1' },
      mapToChangementPuissanceEnregistréTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementPuissanceAccordé-V1',
      },
      mapToChangementPuissanceAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementPuissanceRejeté-V1',
      },
      mapToChangementPuissanceRejetéTimelineItemProps,
    )
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, mapToÉtapeInconnueOuIgnoréeTimelineItemProps)
    .exhaustive();

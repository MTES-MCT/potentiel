import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { demandeIcon } from '../icons';

import {
  mapToPuissanceImportéeTimelineItemsProps,
  mapToPuissanceModifiéeTimelineItemsProps,
  mapToChangementPuissanceDemandéTimelineItemProps,
  mapToChangementPuissanceAnnuléTimelineItemProps,
  mapToChangementPuissanceEnregistréTimelineItemProps,
  mapToChangementPuissanceAccordéTimelineItemProps,
  mapToChangementPuissanceRejetéTimelineItemProps,
} from './events';

export type MapToPuissanceTimelineItemProps = (
  readmodel: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: string,
  icon: IconProps,
) => TimelineItemProps;

export const mapToPuissanceTimelineItemProps = (
  record: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: string,
) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'PuissanceImportée-V1' }, (record) =>
      mapToPuissanceImportéeTimelineItemsProps(record, unitéPuissance, demandeIcon),
    )
    .with({ type: 'PuissanceModifiée-V1' }, (record) =>
      mapToPuissanceModifiéeTimelineItemsProps(record, unitéPuissance, demandeIcon),
    )
    .with(
      {
        type: 'ChangementPuissanceDemandé-V1',
      },
      (record) =>
        mapToChangementPuissanceDemandéTimelineItemProps(record, unitéPuissance, demandeIcon),
    )
    .with(
      {
        type: 'ChangementPuissanceAnnulé-V1',
      },
      (record) =>
        mapToChangementPuissanceAnnuléTimelineItemProps(record, unitéPuissance, demandeIcon),
    )
    .with({ type: 'ChangementPuissanceEnregistré-V1' }, (record) =>
      mapToChangementPuissanceEnregistréTimelineItemProps(record, unitéPuissance, demandeIcon),
    )
    .with(
      {
        type: 'ChangementPuissanceAccordé-V1',
      },
      (record) =>
        mapToChangementPuissanceAccordéTimelineItemProps(record, unitéPuissance, demandeIcon),
    )
    .with(
      {
        type: 'ChangementPuissanceRejeté-V1',
      },
      (record) =>
        mapToChangementPuissanceRejetéTimelineItemProps(record, unitéPuissance, demandeIcon),
    )
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, mapToÉtapeInconnueOuIgnoréeTimelineItemProps)
    .exhaustive();

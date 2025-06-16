import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { demandeIcon } from '../icons';

import {
  mapToReprésentantLégalImportéTimelineItemProps,
  mapToReprésentantLégalModifiéTimelineItemProps,
  mapToChangementReprésentantLégalDemandéTimelineItemProps,
  mapToChangementReprésentantLégalCorrigéTimelineItemProps,
  mapToChangementReprésentantLégalAccordéTimelineItemProps,
  mapToChangementReprésentantLégalRejetéTimelineItemProps,
  mapToChangementReprésentantLégalAnnuléTimelineItemProps,
} from './events';

export type MapToReprésentantLégalTimelineItemProps = (
  readmodel: Historique.HistoriqueReprésentantLégalProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToReprésentantLégalTimelineItemProps = (
  readmodel: Historique.HistoriqueReprésentantLégalProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ReprésentantLégalImporté-V1',
      },
      (event) => mapToReprésentantLégalImportéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ReprésentantLégalModifié-V1',
      },
      (event) => mapToReprésentantLégalModifiéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalDemandé-V1',
      },
      (event) => mapToChangementReprésentantLégalDemandéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalCorrigé-V1',
      },
      (event) => mapToChangementReprésentantLégalCorrigéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAccordé-V1',
      },
      (event) => mapToChangementReprésentantLégalAccordéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalRejeté-V1',
      },
      (event) => mapToChangementReprésentantLégalRejetéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAnnulé-V1',
      },
      (event) => mapToChangementReprésentantLégalAnnuléTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalSupprimé-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

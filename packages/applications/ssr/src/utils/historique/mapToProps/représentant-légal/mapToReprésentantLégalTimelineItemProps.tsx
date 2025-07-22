import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import {
  mapToReprésentantLégalImportéTimelineItemProps,
  mapToReprésentantLégalModifiéTimelineItemProps,
  mapToChangementReprésentantLégalDemandéTimelineItemProps,
  mapToChangementReprésentantLégalCorrigéTimelineItemProps,
  mapToChangementReprésentantLégalAccordéTimelineItemProps,
  mapToChangementReprésentantLégalRejetéTimelineItemProps,
  mapToChangementReprésentantLégalAnnuléTimelineItemProps,
} from './events';

// viovio à changer
export const mapToReprésentantLégalTimelineItemProps = (
  readmodel: Lauréat.ReprésentantLégal.HistoriqueReprésentantLégalProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ReprésentantLégalImporté-V1',
      },
      mapToReprésentantLégalImportéTimelineItemProps,
    )
    .with(
      {
        type: 'ReprésentantLégalModifié-V1',
      },
      mapToReprésentantLégalModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalDemandé-V1',
      },
      mapToChangementReprésentantLégalDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalCorrigé-V1',
      },
      mapToChangementReprésentantLégalCorrigéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAccordé-V1',
      },
      mapToChangementReprésentantLégalAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalRejeté-V1',
      },
      mapToChangementReprésentantLégalRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAnnulé-V1',
      },
      mapToChangementReprésentantLégalAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalEnregistré-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalSupprimé-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

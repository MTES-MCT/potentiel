import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToReprésentantLégalImportéTimelineItemProps,
  mapToReprésentantLégalModifiéTimelineItemProps,
  mapToChangementReprésentantLégalDemandéTimelineItemProps,
  mapToChangementReprésentantLégalCorrigéTimelineItemProps,
  mapToChangementReprésentantLégalAccordéTimelineItemProps,
  mapToChangementReprésentantLégalRejetéTimelineItemProps,
  mapToChangementReprésentantLégalAnnuléTimelineItemProps,
  mapToChangementReprésentantLégalEnregistréTimelineItemProps,
} from './events';
import { mapToChangementReprésentantLégalSuppriméTimelineItemProps } from './events/mapToChangementReprésentantLégalSuppriméTimelineItemProps';

export const mapToReprésentantLégalTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.ReprésentantLégal.HistoriqueReprésentantLégalProjetListItemReadModel;
  isHistoriqueProjet?: true;
}) =>
  match(event)
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
      (event) =>
        mapToChangementReprésentantLégalDemandéTimelineItemProps({ event, isHistoriqueProjet }),
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
      mapToChangementReprésentantLégalEnregistréTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalSupprimé-V1',
      },
      mapToChangementReprésentantLégalSuppriméTimelineItemProps,
    )
    .exhaustive();

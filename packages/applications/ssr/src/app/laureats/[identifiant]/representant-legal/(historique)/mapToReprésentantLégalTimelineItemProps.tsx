import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import {
  mapToChangementReprésentantLégalAccordéTimelineItemProps,
  mapToChangementReprésentantLégalAnnuléTimelineItemProps,
  mapToChangementReprésentantLégalCorrigéTimelineItemProps,
  mapToChangementReprésentantLégalDemandéTimelineItemProps,
  mapToChangementReprésentantLégalEnregistréTimelineItemProps,
  mapToChangementReprésentantLégalRejetéTimelineItemProps,
  mapToReprésentantLégalImportéTimelineItemProps,
  mapToReprésentantLégalModifiéTimelineItemProps,
} from './events';
import { mapToChangementReprésentantLégalSuppriméTimelineItemProps } from './events/mapToChangementReprésentantLégalSuppriméTimelineItemProps';

export const mapToReprésentantLégalTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.HistoriqueReprésentantLégalProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) =>
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
      (event) => mapToChangementReprésentantLégalDemandéTimelineItemProps(event, rôleUtilisateur),
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
      (event) =>
        mapToChangementReprésentantLégalEnregistréTimelineItemProps(event, rôleUtilisateur),
    )
    .with(
      {
        type: 'ChangementReprésentantLégalSupprimé-V1',
      },
      mapToChangementReprésentantLégalSuppriméTimelineItemProps,
    )
    .exhaustive();

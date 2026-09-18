import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import {
  mapToActionnaireImportéTimelineItemProps,
  mapToActionnaireModifiéTimelineItemProps,
  mapToChangementActionnaireAccordéTimelineItemProps,
  mapToChangementActionnaireAnnuléTimelineItemProps,
  mapToChangementActionnaireDemandéTimelineItemProps,
  mapToChangementActionnaireEnregistréTimelineItemProps,
  mapToChangementActionnaireRejetéTimelineItemProps,
} from './events';
import { mapToChangementActionnaireSuppriméTimelineItemProps } from './events/mapToChangementActionnaireSuppriméTimelineItemProps';

export const mapToActionnaireTimelineItemProps = (
  event: Lauréat.Actionnaire.HistoriqueActionnaireProjetListItemReadModel,
  permissionConsulterChangement: boolean,
) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ActionnaireImporté-V1',
      },
      mapToActionnaireImportéTimelineItemProps,
    )
    .with(
      {
        type: 'ActionnaireModifié-V1',
      },
      mapToActionnaireModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireEnregistré-V1',
      },
      (event) =>
        mapToChangementActionnaireEnregistréTimelineItemProps(event, permissionConsulterChangement),
    )
    .with(
      {
        type: 'ChangementActionnaireDemandé-V1',
      },
      (event) =>
        mapToChangementActionnaireDemandéTimelineItemProps(event, permissionConsulterChangement),
    )
    .with(
      {
        type: 'ChangementActionnaireAccordé-V1',
      },
      mapToChangementActionnaireAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireRejeté-V1',
      },
      mapToChangementActionnaireRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireAnnulé-V1',
      },
      mapToChangementActionnaireAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireSupprimé-V1',
      },
      mapToChangementActionnaireSuppriméTimelineItemProps,
    )
    .exhaustive();

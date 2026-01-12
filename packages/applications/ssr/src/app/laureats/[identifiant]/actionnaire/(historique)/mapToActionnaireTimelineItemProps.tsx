import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToActionnaireImportéTimelineItemProps,
  mapToActionnaireModifiéTimelineItemProps,
  mapToChangementActionnaireEnregistréTimelineItemProps,
  mapToChangementActionnaireDemandéTimelineItemProps,
  mapToChangementActionnaireAccordéTimelineItemProps,
  mapToChangementActionnaireRejetéTimelineItemProps,
  mapToChangementActionnaireAnnuléTimelineItemProps,
} from './events';
import { mapToChangementActionnaireSuppriméTimelineItemProps } from './events/mapToChangementActionnaireSuppriméTimelineItemProps';

export const mapToActionnaireTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.Actionnaire.HistoriqueActionnaireProjetListItemReadModel;
  isHistoriqueProjet?: true;
}) =>
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
      mapToChangementActionnaireEnregistréTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireDemandé-V1',
      },
      (event) => mapToChangementActionnaireDemandéTimelineItemProps({ event, isHistoriqueProjet }),
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

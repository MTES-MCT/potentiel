import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import {
  mapToActionnaireImportéTimelineItemProps,
  mapToActionnaireModifiéTimelineItemProps,
  mapToChangementActionnaireAccordéTimelineItemProps,
  mapToChangementActionnaireAnnuléTimelineItemProps,
  mapToChangementActionnaireDemandéTimelineItemProps,
  mapToChangementActionnaireEnregistréTimelineItemProps,
  mapToChangementActionnaireRejetéTimelineItemProps,
} from './events';

export const mapToActionnaireTimelineItemProps = (
  readmodel: Lauréat.Actionnaire.HistoriqueActionnaireProjetListItemReadModel,
) =>
  match(readmodel)
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
      mapToChangementActionnaireDemandéTimelineItemProps,
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
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

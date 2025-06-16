import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { demandeIcon } from '../icons';

import {
  mapToActionnaireImportéTimelineItemProps,
  mapToActionnaireModifiéTimelineItemProps,
  mapToChangementActionnaireEnregistréTimelineItemProps,
  mapToChangementActionnaireDemandéTimelineItemProps,
  mapToChangementActionnaireAccordéTimelineItemProps,
  mapToChangementActionnaireRejetéTimelineItemProps,
  mapToChangementActionnaireAnnuléTimelineItemProps,
} from './events';

export const mapToActionnaireTimelineItemProps = (
  readmodel: Historique.HistoriqueActionnaireProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ActionnaireImporté-V1',
      },
      (event) => mapToActionnaireImportéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ActionnaireModifié-V1',
      },
      (event) => mapToActionnaireModifiéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireEnregistré-V1',
      },
      (event) => mapToChangementActionnaireEnregistréTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireDemandé-V1',
      },
      (event) => mapToChangementActionnaireDemandéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireAccordé-V1',
      },
      (event) => mapToChangementActionnaireAccordéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireRejeté-V1',
      },
      (event) => mapToChangementActionnaireRejetéTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireAnnulé-V1',
      },
      (event) => mapToChangementActionnaireAnnuléTimelineItemProps(event, demandeIcon),
    )
    .with(
      {
        type: 'ChangementActionnaireSupprimé-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

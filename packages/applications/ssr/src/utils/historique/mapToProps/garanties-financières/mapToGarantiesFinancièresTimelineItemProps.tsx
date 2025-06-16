import { match, P } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { garantiesFinancièresIcon } from '../icons';

import {
  garantiesFinancièresActuelles,
  dépôtDeNouvellesGarantiesFinancières,
  mainlevée,
  mapToHistoriqueGarantiesFinancièresEffacéTimelineItemProps,
} from './events';

export type MapToGarantiesFinancièresTimelineItemProps = (
  readmodel: Historique.HistoriqueGarantiesFinancièresProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToGarantiesFinancièresTimelineItemProps = (
  record: Historique.HistoriqueGarantiesFinancièresProjetListItemReadModel,
) =>
  match(record)
    .returnType<TimelineItemProps>()

    // Garanties financières actuelles du projet
    .with(
      {
        type: 'TypeGarantiesFinancièresImporté-V1',
      },
      (event) =>
        garantiesFinancièresActuelles.mapToTypeGarantiesFinancièresImportéTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'GarantiesFinancièresDemandées-V1',
      },
      (event) =>
        garantiesFinancièresActuelles.mapToGarantiesFinancièresDemandéesTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with({ type: 'GarantiesFinancièresEnregistrées-V1' }, (event) =>
      garantiesFinancièresActuelles.mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps(
        event,
        garantiesFinancièresIcon,
      ),
    )
    .with(
      {
        type: 'AttestationGarantiesFinancièresEnregistrée-V1',
      },
      (event) =>
        garantiesFinancièresActuelles.mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'GarantiesFinancièresModifiées-V1',
      },
      (event) =>
        garantiesFinancièresActuelles.mapToGarantiesFinancièresModifiéesTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'GarantiesFinancièresÉchues-V1',
      },
      (event) =>
        garantiesFinancièresActuelles.mapToGarantiesFinancièresÉchuesTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'HistoriqueGarantiesFinancièresEffacé-V1',
      },
      (event) =>
        mapToHistoriqueGarantiesFinancièresEffacéTimelineItemProps(event, garantiesFinancièresIcon),
    )

    // Dépôt de garanties financières pour le projet
    .with(
      {
        type: 'DépôtGarantiesFinancièresSoumis-V1',
      },
      (event) =>
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
      },
      (event) =>
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: P.union(
          'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
          'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
        ),
      },
      (event) =>
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: P.union(
          'DépôtGarantiesFinancièresEnCoursValidé-V1',
          'DépôtGarantiesFinancièresEnCoursValidé-V2',
        ),
      },
      (event) =>
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )

    // Mainlevée des garanties financières
    .with(
      {
        type: 'MainlevéeGarantiesFinancièresDemandée-V1',
      },
      (event) =>
        mainlevée.mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
      },
      (event) =>
        mainlevée.mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
      },
      (event) =>
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
      },
      (event) =>
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .with(
      {
        type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
      },
      (event) =>
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps(
          event,
          garantiesFinancièresIcon,
        ),
    )
    .exhaustive();

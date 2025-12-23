import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import {
  garantiesFinancièresActuelles,
  dépôtDeNouvellesGarantiesFinancières,
  mainlevée,
} from './events';

type MapToGarantiesFinancièresTimelineItemProps = (
  record: Lauréat.HistoriqueGarantiesFinancièresProjetListItemReadModel,
) => TimelineItemProps;

export const mapToGarantiesFinancièresTimelineItemProps: MapToGarantiesFinancièresTimelineItemProps =
  (record) =>
    match(record)
      // Garanties financières actuelles du projet
      .with(
        {
          type: 'TypeGarantiesFinancièresImporté-V1',
        },
        garantiesFinancièresActuelles.mapToTypeGarantiesFinancièresImportéTimelineItemsProps,
      )
      .with(
        { type: 'GarantiesFinancièresImportées-V1' },
        garantiesFinancièresActuelles.mapToGarantiesFinancièresImportéesTimelineItemsProps,
      )
      .with(
        {
          type: 'GarantiesFinancièresDemandées-V1',
        },
        garantiesFinancièresActuelles.mapToGarantiesFinancièresDemandéesTimelineItemsProps,
      )
      .with(
        { type: 'GarantiesFinancièresEnregistrées-V1' },
        garantiesFinancièresActuelles.mapToGarantiesFinancièresEnregistréesTimelineItemsProps,
      )
      .with(
        {
          type: 'AttestationGarantiesFinancièresEnregistrée-V1',
        },
        garantiesFinancièresActuelles.mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps,
      )
      .with(
        {
          type: 'GarantiesFinancièresModifiées-V1',
        },
        garantiesFinancièresActuelles.mapToGarantiesFinancièresModifiéesTimelineItemsProps,
      )
      .with(
        {
          type: 'GarantiesFinancièresÉchues-V1',
        },
        garantiesFinancièresActuelles.mapToGarantiesFinancièresÉchuesTimelineItemsProps,
      )
      .with(
        {
          type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        },
        mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
      )

      // Dépôt de garanties financières pour le projet
      .with(
        {
          type: 'DépôtGarantiesFinancièresSoumis-V1',
        },
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresSoumisTimelineItemsProps,
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
        },
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps,
      )
      .with(
        {
          type: P.union(
            'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
            'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
          ),
        },
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps,
      )
      .with(
        {
          type: P.union(
            'DépôtGarantiesFinancièresEnCoursValidé-V1',
            'DépôtGarantiesFinancièresEnCoursValidé-V2',
          ),
        },
        dépôtDeNouvellesGarantiesFinancières.mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps,
      )

      // Mainlevée des garanties financières
      .with(
        {
          type: 'MainlevéeGarantiesFinancièresDemandée-V1',
        },
        mainlevée.mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps,
      )
      .with(
        {
          type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
        },
        mainlevée.mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
        },
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
        },
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
        },
        mainlevée.mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps,
      )
      .exhaustive();

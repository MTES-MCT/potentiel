import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import {
  dépôtGarantiesFinancièresSoumisProjector,
  dépôtGarantiesFinancièresEnCoursModifiéProjector,
  dépôtGarantiesFinancièresEnCoursSuppriméProjector,
  dépôtGarantiesFinancièresEnCoursValidéProjector,
} from './dépôt';
import {
  garantiesFinancièresDemandéesProjector,
  typeGarantiesFinancièresImportéProjector,
  attestationGarantiesFinancièresProjector,
  garantiesFinancièresEnregistréesProjector,
  garantiesFinancièresModifiéesProjector,
  garantiesFinancièresÉchuesProjector,
} from './actuelles';
import { historiqueGarantiesFinancièresEffacéProjector } from './historiqueGarantiesFinancièresEffacé.projector';
import {
  demandeMainlevéeGarantiesFinancièresAccordéeProjector,
  demandeMainlevéeGarantiesFinancièresAnnuléeProjector,
  demandeMainlevéeGarantiesFinancièresRejetéeProjector,
  instructionDemandeMainlevéeGarantiesFinancièresDémarréeProjector,
  mainlevéeGarantiesFinancièresDemandéeProjector,
} from './mainlevée';
import { garantiesFinancièresRebuildTriggeredProjector } from './garantiesFinancièresRebuildTriggered.projector';

export type SubscriptionEvent =
  | (Lauréat.GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.GarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      //////////// Rebuild
      .with({ type: 'RebuildTriggered' }, garantiesFinancièresRebuildTriggeredProjector)

      //////////// Dépôt
      .with(
        { type: 'DépôtGarantiesFinancièresSoumis-V1' },
        dépôtGarantiesFinancièresSoumisProjector,
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
        },
        dépôtGarantiesFinancièresEnCoursModifiéProjector,
      )
      .with(
        {
          type: P.union(
            'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
            'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
          ),
        },
        dépôtGarantiesFinancièresEnCoursSuppriméProjector,
      )
      .with(
        {
          type: P.union(
            'DépôtGarantiesFinancièresEnCoursValidé-V1',
            'DépôtGarantiesFinancièresEnCoursValidé-V2',
          ),
        },
        dépôtGarantiesFinancièresEnCoursValidéProjector,
      )
      //////////// Garanties financières actuelles
      .with(
        {
          type: 'GarantiesFinancièresDemandées-V1',
        },
        garantiesFinancièresDemandéesProjector,
      )
      .with(
        {
          type: 'TypeGarantiesFinancièresImporté-V1',
        },
        typeGarantiesFinancièresImportéProjector,
      )
      .with(
        {
          type: 'AttestationGarantiesFinancièresEnregistrée-V1',
        },
        attestationGarantiesFinancièresProjector,
      )
      .with(
        {
          type: 'GarantiesFinancièresEnregistrées-V1',
        },
        garantiesFinancièresEnregistréesProjector,
      )
      .with(
        {
          type: 'GarantiesFinancièresModifiées-V1',
        },
        garantiesFinancièresModifiéesProjector,
      )
      .with(
        {
          type: 'GarantiesFinancièresÉchues-V1',
        },
        garantiesFinancièresÉchuesProjector,
      )
      .with(
        { type: 'HistoriqueGarantiesFinancièresEffacé-V1' },
        historiqueGarantiesFinancièresEffacéProjector,
      )
      //////////// Mainlevée
      .with(
        {
          type: 'MainlevéeGarantiesFinancièresDemandée-V1',
        },
        mainlevéeGarantiesFinancièresDemandéeProjector,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
        },
        demandeMainlevéeGarantiesFinancièresAnnuléeProjector,
      )
      .with(
        {
          type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
        },
        instructionDemandeMainlevéeGarantiesFinancièresDémarréeProjector,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
        },
        demandeMainlevéeGarantiesFinancièresAccordéeProjector,
      )
      .with(
        {
          type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
        },
        demandeMainlevéeGarantiesFinancièresRejetéeProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};

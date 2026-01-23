import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import {
  dépôtGarantiesFinancièresSoumisProjector,
  dépôtGarantiesFinancièresEnCoursModifiéProjector,
  dépôtGarantiesFinancièresEnCoursSuppriméProjector,
  dépôtGarantiesFinancièresEnCoursValidéProjector,
} from './dépôt/index.js';
import {
  garantiesFinancièresDemandéesProjector,
  typeGarantiesFinancièresImportéProjector,
  attestationGarantiesFinancièresEnregistréeProjector,
  garantiesFinancièresEnregistréesProjector,
  garantiesFinancièresModifiéesProjector,
  garantiesFinancièresÉchuesProjector,
  garantiesFinancièresImportéesProjector,
} from './actuelles/index.js';
import { historiqueGarantiesFinancièresEffacéProjector } from './historiqueGarantiesFinancièresEffacé.projector.js';
import {
  demandeMainlevéeGarantiesFinancièresAccordéeProjector,
  demandeMainlevéeGarantiesFinancièresAnnuléeProjector,
  demandeMainlevéeGarantiesFinancièresRejetéeProjector,
  instructionDemandeMainlevéeGarantiesFinancièresDémarréeProjector,
  mainlevéeGarantiesFinancièresDemandéeProjector,
} from './mainlevée/index.js';
import { garantiesFinancièresRebuildTriggeredProjector } from './garantiesFinancièresRebuildTriggered.projector.js';

export type SubscriptionEvent =
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEvent
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.GarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      //#region Rebuild
      .with({ type: 'RebuildTriggered' }, garantiesFinancièresRebuildTriggeredProjector)
      //#endregion Rebuild
      //#region Dépôt
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
      //#endregion Dépôt
      //#region Actuelles
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
          type: 'GarantiesFinancièresImportées-V1',
        },
        garantiesFinancièresImportéesProjector,
      )
      .with(
        {
          type: 'AttestationGarantiesFinancièresEnregistrée-V1',
        },
        attestationGarantiesFinancièresEnregistréeProjector,
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
      //#endregion Actuelles
      //#region Mainlevée
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
      //#endregion Mainlevée
      .exhaustive();

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};

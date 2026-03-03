import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleAttestationGarantiesFinancièresEnregistrée,
  handleDemandeMainlevéeMiseÀJour,
  handleDépôtGarantiesFinancièresSoumis,
  handleDépôtGarantiesFinancièresValidé,
  handleGarantiesFinancièresMiseÀJour,
  handleGarantiesFinancièresÉchues,
  handleMainlevéeDemandée,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.GarantiesFinancières.GarantiesFinancièresEvent;

export type Execute = Message<
  'System.Notification.Lauréat.GarantiesFinancières',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return (
      match(event)
        //#region Dépôt
        .with(
          {
            type: 'DépôtGarantiesFinancièresSoumis-V1',
          },
          handleDépôtGarantiesFinancièresSoumis,
        )
        .with(
          {
            type: P.union(
              'DépôtGarantiesFinancièresEnCoursValidé-V1',
              'DépôtGarantiesFinancièresEnCoursValidé-V2',
            ),
          },
          handleDépôtGarantiesFinancièresValidé,
        )
        //#endregion Dépôt
        //#region Actuelles
        .with(
          { type: 'AttestationGarantiesFinancièresEnregistrée-V1' },
          handleAttestationGarantiesFinancièresEnregistrée,
        )
        .with(
          {
            type: P.union(
              'GarantiesFinancièresEnregistrées-V1',
              'GarantiesFinancièresModifiées-V1',
            ),
          },
          handleGarantiesFinancièresMiseÀJour,
        )

        //#endregion Actuelles
        //#region Mainlevée
        .with({ type: 'MainlevéeGarantiesFinancièresDemandée-V1' }, handleMainlevéeDemandée)
        .with(
          {
            type: P.union(
              'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
              'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
              'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
            ),
          },
          handleDemandeMainlevéeMiseÀJour,
        )
        .with({ type: 'GarantiesFinancièresÉchues-V1' }, handleGarantiesFinancièresÉchues)
        //#endregion Mainlevée
        //#region Évènements ignorés
        .with(
          {
            type: P.union(
              'DépôtGarantiesFinancièresEnCoursModifié-V1',
              'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
              'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
              'GarantiesFinancièresDemandées-V1',
              'GarantiesFinancièresImportées-V1',
              'HistoriqueGarantiesFinancièresEffacé-V1',
              'TypeGarantiesFinancièresImporté-V1',
              'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
            ),
          },
          () => Promise.resolve(),
        )
        //#endregion Évènements ignorés
        .exhaustive()
    );
  };

  mediator.register('System.Notification.Lauréat.GarantiesFinancières', handler);
};

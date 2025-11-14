import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat } from '@/helpers';
import { SendEmail } from '@/sendEmail';

import {
  handleAttestationGarantiesFinancièresEnregistrée,
  handleDemandeMainlevéeMiseÀJour,
  handleDépôtGarantiesFinancièresSoumis,
  handleDépôtGarantiesFinancièresValidé,
  handleGarantiesFinancièresMiseÀJour,
  handleGarantiesFinancièresÉchues,
  handleMainlevéeDemandée,
} from './handlers.js';

export type SubscriptionEvent = Lauréat.GarantiesFinancières.GarantiesFinancièresEvent;

export type Execute = Message<
  'System.Notification.Lauréat.GarantiesFinancières',
  SubscriptionEvent
>;

export type RegisterGarantiesFinancièresNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterGarantiesFinancièresNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());
    const baseUrl = getBaseUrl();
    return (
      match(event)
        //#region Dépôt
        .with(
          {
            type: 'DépôtGarantiesFinancièresSoumis-V1',
          },
          (event) =>
            handleDépôtGarantiesFinancièresSoumis({
              event,
              sendEmail,
              projet,
              baseUrl,
            }),
        )
        .with(
          {
            type: P.union(
              'DépôtGarantiesFinancièresEnCoursValidé-V1',
              'DépôtGarantiesFinancièresEnCoursValidé-V2',
            ),
          },
          (event) => handleDépôtGarantiesFinancièresValidé({ event, sendEmail, projet, baseUrl }),
        )
        //#endregion Dépôt
        //#region Actuelles
        .with({ type: 'AttestationGarantiesFinancièresEnregistrée-V1' }, (event) =>
          handleAttestationGarantiesFinancièresEnregistrée({
            event,
            sendEmail,
            projet,
            baseUrl,
          }),
        )
        .with(
          {
            type: P.union(
              'GarantiesFinancièresEnregistrées-V1',
              'GarantiesFinancièresModifiées-V1',
            ),
          },
          (event) =>
            handleGarantiesFinancièresMiseÀJour({
              event,
              sendEmail,
              projet,
              baseUrl,
            }),
        )

        //#endregion Actuelles
        //#region Mainlevée
        .with({ type: 'MainlevéeGarantiesFinancièresDemandée-V1' }, (event) =>
          handleMainlevéeDemandée({
            event,
            sendEmail,
            projet,
            baseUrl,
          }),
        )
        .with(
          {
            type: P.union(
              'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
              'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
              'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
            ),
          },
          (event) =>
            handleDemandeMainlevéeMiseÀJour({
              event,
              sendEmail,
              projet,
              baseUrl,
            }),
        )
        .with({ type: 'GarantiesFinancièresÉchues-V1' }, (event) =>
          handleGarantiesFinancièresÉchues({ event, sendEmail, projet, baseUrl }),
        )
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

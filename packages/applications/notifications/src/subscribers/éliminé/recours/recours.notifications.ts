import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';
import { getBaseUrl, getCandidature } from '@helpers';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import {
  handleRecoursDemandé,
  handleRecoursAnnulé,
  handleRecoursAccordé,
  handleRecoursRejeté,
  handleRecoursPasséEnInstruction,
} from './handlers';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

export type RegisterRecoursNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterRecoursNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const candidature = await getCandidature(identifiantProjet.formatter());
    const projet = {
      ...candidature,
      url: getBaseUrl() + Routes.Projet.details(identifiantProjet.formatter()),
    };

    await match(event)
      .with({ type: 'RecoursDemandé-V1' }, (event) =>
        handleRecoursDemandé({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursAnnulé-V1' }, (event) =>
        handleRecoursAnnulé({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursAccordé-V1' }, (event) =>
        handleRecoursAccordé({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursRejeté-V1' }, (event) =>
        handleRecoursRejeté({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursPasséEnInstruction-V1' }, (event) =>
        handleRecoursPasséEnInstruction({ sendEmail, event, projet }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};

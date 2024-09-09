import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Éliminé } from '@potentiel-domain/elimine';
import { Lauréat } from '@potentiel-domain/laureat';

import { buildCertificate } from './buildCertificate';

export type SubscriptionEvent = Éliminé.ÉliminéNotifié | Lauréat.LauréatNotifié;

export type Execute = Message<'System.Candidature.Attestation.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger('System.Candidature.Attestation.Saga.Execute');
    const {
      payload: {
        identifiantProjet,
        attestation: { format },
        notifiéLe,
        notifiéPar,
      },
    } = event;
    switch (event.type) {
      case 'ÉliminéNotifié-V1':
      case 'LauréatNotifié-V1':
        const content = await buildCertificate({ identifiantProjet, notifiéLe, notifiéPar });
        if (!content) {
          logger.warn(`Impossible de générer l'attestation du projet ${identifiantProjet}`);
          return;
        }
        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notifiéLe,
          format,
        );

        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            content,
            documentProjet: attestation,
          },
        });

        break;
    }
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};

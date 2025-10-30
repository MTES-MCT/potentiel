import { match } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat, listerPorteursRecipients } from '../../../_helpers';
import { EmailPayload, SendEmail } from '../../../sendEmail';

import { lauréatNotificationTemplateId } from './constant';

type CahierDesChargesChoisiNotificationProps = {
  sendEmail: SendEmail;
  event: Lauréat.CahierDesChargesChoisiEvent;
};

export const cahierDesChargesChoisiNotification = async ({
  event: { payload },
  sendEmail,
}: CahierDesChargesChoisiNotificationProps) => {
  const lauréat = await getLauréat(payload.identifiantProjet);
  const recipients = await listerPorteursRecipients(lauréat.identifiantProjet);
  const cahierDesCharges = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
    payload.cahierDesCharges,
  );

  const messageSubject = `Potentiel - Nouveau mode d'instruction choisi pour les demandes liées à votre projet ${lauréat.nom}`;
  const email = match(cahierDesCharges)
    .returnType<EmailPayload>()
    .with({ type: 'initial' }, () => ({
      templateId: lauréatNotificationTemplateId.cahierDesCharges.initialChoisi,
      messageSubject,
      recipients,
      variables: {
        nom_projet: lauréat.nom,
        projet_url: lauréat.url,
      },
    }))
    .with({ type: 'modifié' }, ({ paruLe, alternatif }) => ({
      templateId: lauréatNotificationTemplateId.cahierDesCharges.modifiéChoisi,
      messageSubject,
      recipients,
      variables: {
        nom_projet: lauréat.nom,
        projet_url: lauréat.url,
        cdc_date: paruLe,
        cdc_alternatif: alternatif ? 'alternatif ' : '',
      },
    }))
    .exhaustive();

  await sendEmail(email);
};

import { match } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { getLauréat } from '../../../helpers/getLauréat';
import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';
import { EmailPayload } from '../../../sendEmail';

import { lauréatNotificationTemplateId } from './constant';

export const cahierDesChargesChoisiNotification = async ({
  payload,
}: Lauréat.CahierDesChargesChoisiEvent): Promise<EmailPayload[]> => {
  const lauréat = await getLauréat(payload.identifiantProjet);
  const recipients = await listerPorteursRecipients(lauréat.identifiantProjet);
  const cahierDesCharges = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
    payload.cahierDesCharges,
  );

  const messageSubject = `Potentiel - Nouveau mode d'instruction choisi pour les demandes liées à votre projet ${lauréat.nomProjet}`;
  return match(cahierDesCharges)
    .returnType<EmailPayload[]>()
    .with({ type: 'initial' }, () => [
      {
        templateId: lauréatNotificationTemplateId.cahierDesCharges.initialChoisi,
        messageSubject,
        recipients,
        variables: {
          nom_projet: lauréat.nomProjet,
          projet_url: lauréat.url,
        },
      },
    ])
    .with({ type: 'modifié' }, ({ paruLe, alternatif }) => [
      {
        templateId: lauréatNotificationTemplateId.cahierDesCharges.modifiéChoisi,
        messageSubject,
        recipients,
        variables: {
          nom_projet: lauréat.nomProjet,
          projet_url: lauréat.url,
          cdc_date: paruLe,
          cdc_alternatif: alternatif ? 'alternatif ' : '',
        },
      },
    ])
    .exhaustive();
};

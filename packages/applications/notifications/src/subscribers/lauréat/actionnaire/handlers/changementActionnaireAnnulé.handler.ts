import { listerDrealsRecipients } from '@/helpers';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { actionnaireNotificationTemplateId } from '../constant';
import { ActionnaireNotificationsProps } from '../type';

export const handleChangementActionnaireAnnulé = async ({
  sendEmail,
  event,
  projet,
}: ActionnaireNotificationsProps<Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.annuler,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été annulée`,
    recipients: dreals,
    variables: {
      type: 'annulation',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

import { représentantLégalNotificationTemplateId } from './constant';

type ChangementReprésentantLégalRejetéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const changementReprésentantLégalRejetéNotification = async ({
  sendEmail,
  event,
  projet,
}: ChangementReprésentantLégalRejetéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalRejetéNotification',
    });
    return;
  }

  await sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.rejeter,
    messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  if (event.payload.rejetAutomatique) {
    const dreals = await listerDrealsRecipients(projet.région);

    if (dreals.length === 0) {
      getLogger().info('Aucune dreal trouvée', {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'changementReprésentantLégalRejetéNotification',
      });
      return;
    }

    await sendEmail({
      templateId: représentantLégalNotificationTemplateId.changement.accordOuRejetAutomatique,
      messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée automatiquement`,
      recipients: dreals,
      variables: {
        type: 'rejet',
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: projet.url,
      },
    });
  }
};

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';
import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

import { représentantLégalNotificationTemplateId } from './constant';

type ChangementReprésentantLégalAccordéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalAccordéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalAccordéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalAccordéNotification',
    });
    return;
  }

  const templateIdMailPorteur = event.payload.avecCorrection
    ? représentantLégalNotificationTemplateId.changement.accord.avecCorrection
    : représentantLégalNotificationTemplateId.changement.accord.sansCorrection;
  const mailSubjectMailPorteur = event.payload.avecCorrection
    ? `Potentiel - Correction et accord de la demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`
    : `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été accordée`;

  await sendEmail({
    templateId: templateIdMailPorteur,
    messageSubject: mailSubjectMailPorteur,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });

  if (event.payload.accordAutomatique) {
    const dreals = await listerDrealsRecipients(projet.région);

    if (dreals.length === 0) {
      getLogger().error('Aucune dreal trouvée', {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'changementReprésentantLégalAccordéNotification',
      });
      return;
    }

    return sendEmail({
      templateId: représentantLégalNotificationTemplateId.changement.accordOuRejetAutomatique,
      messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été accordée automatiquement`,
      recipients: dreals,
      variables: {
        type: 'accord',
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
      },
    });
  }
};

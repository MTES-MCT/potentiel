import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';
import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';

import { RegisterProducteurNotificationDependencies } from '.';

import { producteurNotificationTemplateId } from './constant';

type ChangementProducteurEnregistréNotificationProps = {
  sendEmail: RegisterProducteurNotificationDependencies['sendEmail'];
  event: Lauréat.Producteur.ChangementProducteurEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementProducteurEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementProducteurEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().error('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: producteurNotificationTemplateId.enregistrerChangement,
    messageSubject: `Potentiel - Déclaration de changement de producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Producteur.changement.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });

  await sendEmail({
    templateId: producteurNotificationTemplateId.enregistrerChangement,
    messageSubject: `Potentiel - Déclaration de changement de producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Producteur.changement.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};

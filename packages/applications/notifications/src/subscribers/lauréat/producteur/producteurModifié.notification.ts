import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';
import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterProducteurNotificationDependencies } from '.';

import { producteurNotificationTemplateId } from './constant';

type ProducteurModifiéNotificationProps = {
  sendEmail: RegisterProducteurNotificationDependencies['sendEmail'];
  event: Lauréat.Producteur.ProducteurModifiéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const producteurModifiéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ProducteurModifiéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().error('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'producteurModifiéNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: producteurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    templateId: producteurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

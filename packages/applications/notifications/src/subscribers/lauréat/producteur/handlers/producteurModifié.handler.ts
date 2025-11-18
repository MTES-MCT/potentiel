import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { producteurNotificationTemplateId } from '../constant.js';
import { ProducteurNotificationsProps } from '../type.js';

export const handleProducteurModifié = async ({
  sendEmail,
  event,
  projet,
}: ProducteurNotificationsProps<Lauréat.Producteur.ProducteurModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: producteurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: producteurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};

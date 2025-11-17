import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { fournisseurNotificationTemplateId } from '../constant.js';
import { FournisseurNotificationsProps } from '../type.js';

export const handleFournisseurModifié = async ({
  sendEmail,
  event,
  projet,
}: FournisseurNotificationsProps<Lauréat.Fournisseur.FournisseurModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};

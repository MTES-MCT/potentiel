import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { lauréatNotificationTemplateId } from '../constant.js';
import { LauréatNotificationsProps } from '../type.js';

export const handleNomProjetModifié = async ({
  sendEmail,
  event,
}: LauréatNotificationsProps<Lauréat.NomProjetModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const projet = await getLauréat(identifiantProjet.formatter());
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: lauréatNotificationTemplateId.nomProjet.modifier,
    messageSubject: `Potentiel - Modification du nom du projet ${event.payload.ancienNomProjet} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      ancien_nom_projet: event.payload.ancienNomProjet,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet.formatter())})}`,
    },
  });

  await sendEmail({
    templateId: lauréatNotificationTemplateId.nomProjet.modifier,
    messageSubject: `Potentiel - Modification du nom du projet ${event.payload.ancienNomProjet} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      ancien_nom_projet: event.payload.ancienNomProjet,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet.formatter())})}`,
    },
  });
};

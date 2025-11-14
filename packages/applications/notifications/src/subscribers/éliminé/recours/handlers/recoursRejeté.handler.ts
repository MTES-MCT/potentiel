import { mediator } from 'mediateur';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerDgecRecipients, listerPorteursRecipients } from '#helpers';

import { recoursNotificationTemplateId } from '../constant.js';
import { RecoursNotificationsProps } from '../type.js';

export const handleRecoursRejeté = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursRejetéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const utilisateursCre = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      roles: [Role.cre.nom],
      actif: true,
    },
  });
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerDgecRecipients(identifiantProjet);

  const creRecipients = utilisateursCre.items.map(({ email }) => ({ email }));

  await sendEmail({
    templateId: recoursNotificationTemplateId.rejeter,
    messageSubject: `Potentiel - Demande de recours rejetée pour le projet ${projet.nom} (${identifiantProjet.appelOffre} période ${identifiantProjet.période})`,
    recipients: porteursRecipients,
    bcc: [...adminRecipients, ...creRecipients],
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};

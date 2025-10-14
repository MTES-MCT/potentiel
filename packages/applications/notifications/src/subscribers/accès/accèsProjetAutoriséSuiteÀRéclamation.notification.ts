import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { getBaseUrl, getCandidature, listerDrealsRecipients } from '../../helpers';
import { EmailPayload } from '../../sendEmail';

import { accèsNotificationTemplateId } from './constant';

export async function accèsProjetAutoriséSuiteÀRéclamationNotification({
  payload: { identifiantProjet, identifiantUtilisateur },
}: Accès.AccèsProjetAutoriséEvent): Promise<Array<EmailPayload>> {
  const { nom, département, région } = await getCandidature(identifiantProjet);

  const emailPayloads: EmailPayload[] = [];

  const variables = {
    nom_projet: nom,
    departement_projet: département,
    projet_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
  };

  emailPayloads.push({
    templateId: accèsNotificationTemplateId.accèsProjetAutorisé.porteur,
    messageSubject: `Potentiel - Récupération de la gestion du projet ${nom}`,
    recipients: [
      {
        email: identifiantUtilisateur,
      },
    ],
    variables,
  });

  const dreals = await listerDrealsRecipients(région);

  if (dreals.length > 0) {
    emailPayloads.push({
      templateId: accèsNotificationTemplateId.accèsProjetAutorisé.dreal,
      messageSubject: `Potentiel - Récupération de la gestion du projet ${nom}`,
      recipients: dreals,
      variables,
    });
  }

  return emailPayloads;
}

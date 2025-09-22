import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { SendEmail } from '../../../sendEmail';
import { getAppelOffre, getBaseUrl, listerPorteursRecipients } from '../../../helpers';

import { recoursNotificationTemplateId } from './constant';

type RecoursDemandéNotificationsProps = {
  sendEmail: SendEmail;
  event: Éliminé.Recours.RecoursDemandéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const recoursDemandéNotification = async ({
  sendEmail,
  event,
  projet,
}: RecoursDemandéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const appelOffres = await getAppelOffre(identifiantProjet.appelOffre);
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = [{ email: appelOffres.dossierSuiviPar }];

  await sendEmail({
    templateId: recoursNotificationTemplateId.demander,
    messageSubject: `Potentiel - Nouvelle demande de recours pour le projet ${projet.nom} (${identifiantProjet.appelOffre} période ${identifiantProjet.période})`,
    recipients: porteursRecipients,
    bcc: adminRecipients,
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { RegisterFournisseurNotificationDependencies } from '.';

import { fournisseurNotificationTemplateId } from './constant';

type ÉvaluationCarboneSimplifiéeModifiéeNotificationsProps = {
  sendEmail: RegisterFournisseurNotificationDependencies['sendEmail'];
  event: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const évaluationCarboneSimplifiéeModifiéeNotifications = async ({
  sendEmail,
  event,
  projet,
}: ÉvaluationCarboneSimplifiéeModifiéeNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'évaluationCarboneSimplifiéeModifiéeNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifierÉvaluationCarbone,
    messageSubject: `Potentiel - Modification de l'évaluation carbone simplifiée pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifierÉvaluationCarbone,
    messageSubject: `Potentiel - Modification de l'évaluation carbone simplifiée pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};

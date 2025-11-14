import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '@/helpers';

import { fournisseurNotificationTemplateId } from '../constant.js';
import { FournisseurNotificationsProps } from '../type.js';

export const handleÉvaluationCarboneSimplifiéeModifiée = async ({
  sendEmail,
  event,
  projet,
}: FournisseurNotificationsProps<Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
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

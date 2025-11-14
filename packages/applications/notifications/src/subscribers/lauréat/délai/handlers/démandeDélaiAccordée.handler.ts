import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '@/helpers';

import { délaiNotificationTemplateId } from '../constant.js';
import { DélaiNotificationsProps } from '../type.js';

export const handleDemandeDélaiAccordée = async ({
  sendEmail,
  event,
  projet,
}: DélaiNotificationsProps<Lauréat.Délai.DélaiAccordéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: délaiNotificationTemplateId.demande.accorder,
    messageSubject: `Potentiel - La demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département} a été accordée`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};

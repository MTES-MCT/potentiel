import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';
import { producteurNotificationTemplateId } from '../constant';
import { ProducteurNotificationsProps } from '../type';

export const handleProducteurModifié = async ({
  sendEmail,
  event,
  projet,
}: ProducteurNotificationsProps<Lauréat.Producteur.ProducteurModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvée', {
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

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '../../../_helpers';

import { RegisterDélaiNotificationDependencies } from '.';

import { délaiNotificationTemplateId } from './constant';

type DemandeDélaiAccordéeNotificationProps = {
  sendEmail: RegisterDélaiNotificationDependencies['sendEmail'];
  event: Lauréat.Délai.DélaiAccordéEvent;
  projet: { nom: string; département: string; url: string };
};

export const demandeDélaiAccordéeNotification = async ({
  sendEmail,
  event,
  projet,
}: DemandeDélaiAccordéeNotificationProps) => {
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

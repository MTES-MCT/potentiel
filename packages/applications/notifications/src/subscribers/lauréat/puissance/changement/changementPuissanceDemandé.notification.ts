import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { Recipient } from '../../../../sendEmail';
import { getDgecRecipient } from '../../../../helpers/getDgecRecipient';

type ChangementPuissanceDemandéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.ChangementPuissanceDemandéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementPuissanceDemandéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceDemandéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const templateId = 6887674;

  const recipients: Array<Recipient> = [];

  if (event.payload.autoritéCompétente === 'dreal') {
    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    if (dreals.length === 0) {
      getLogger().error('Aucune dreal trouvée', {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'demandeChangementPuissanceAnnuléeNotification',
      });
      return;
    }

    recipients.push(...dreals);
  } else if (event.payload.autoritéCompétente === 'dgec-admin') {
    recipients.push(getDgecRecipient());
  }

  return sendEmail({
    templateId,
    messageSubject: `Potentiel - changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} demandé`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Puissance.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};

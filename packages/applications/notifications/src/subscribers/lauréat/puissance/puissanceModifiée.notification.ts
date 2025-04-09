import { récupérerPorteursParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '.';

type PuissanceModifiéeNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.PuissanceModifiéeEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const puissanceModifiéeNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: PuissanceModifiéeNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'puissanceModifiéeNotification',
    });
    return;
  }

  return sendEmail({
    templateId: 6886963,
    messageSubject: `Potentiel - La puissance pour le projet ${projet.nom} dans le département ${projet.département} a été modifiée`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

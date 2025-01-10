import { récupérerPorteursParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Actionnaire } from '@potentiel-domain/laureat';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './templateIds';

type HandleChangementActionnaireRejetéeProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.DemandeChangementActionnaireRejetéeEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const handleDemandeChangementActionnaireRejetée = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: HandleChangementActionnaireRejetéeProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  console.log(porteurs);

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.rejeter,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Actionnaire.changement.détail(identifiantProjet.formatter())}`,
    },
  });
};

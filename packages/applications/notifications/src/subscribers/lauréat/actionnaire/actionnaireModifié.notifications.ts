import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Actionnaire } from '@potentiel-domain/laureat';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './templateIds';

type ActionnaireModifiéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ActionnaireModifiéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const actionnaireModifiéNotifications = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ActionnaireModifiéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);
  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

  if (porteurs.length === 0 && dreals.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'actionnaireModifié.notifications.ts',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification de l'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: [...porteurs, ...dreals],
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

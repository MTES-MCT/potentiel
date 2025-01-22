import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type ChangementReprésentantLégalRejetéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalRejetéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalRejetéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalRejetéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);
  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalRejetéNotification',
    });
    return;
  }

  await sendEmail({
    templateId: 6582166,
    messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });

  if (event.payload.rejetAutomatique) {
    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    if (dreals.length === 0) {
      getLogger().error('Aucune dreal trouvée', {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'changementReprésentantLégalRejetéNotification',
      });
      return;
    }

    await sendEmail({
      templateId: 6611643,
      messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée automatiquement`,
      recipients: dreals,
      variables: {
        type: 'rejet',
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
      },
    });
  }
};

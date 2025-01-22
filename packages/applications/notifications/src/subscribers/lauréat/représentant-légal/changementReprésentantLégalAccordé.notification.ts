import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type ChangementReprésentantLégalAccordéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalAccordéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalAccordéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalAccordéNotification',
    });
    return;
  }

  if (event.payload.accordAutomatique) {
    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    if (dreals.length === 0) {
      getLogger().error('Aucune dreal trouvée', {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'changementReprésentantLégalAccordéNotification',
      });
      return;
    }

    return sendEmail({
      templateId: 6611643,
      messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été accordée automatiquement`,
      recipients: dreals,
      variables: {
        type: 'accord',
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
      },
    });
  }

  const changement =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
      data: {
        identifiantProjet: event.payload.identifiantProjet,
      },
    });

  if (Option.isNone(changement)) {
    getLogger().error('Aucune demande de changement de représentant légal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalAccordéNotification',
    });
    return;
  }

  if (changement.demande.nomReprésentantLégal !== event.payload.nomReprésentantLégal) {
    return sendEmail({
      templateId: 6661131,
      messageSubject: `Potentiel - Correction et accord de la demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
      recipients: porteurs,
      variables: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter())}`,
      },
    });
  }

  return sendEmail({
    templateId: 6582166,
    messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été accordée`,
    recipients: porteurs,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

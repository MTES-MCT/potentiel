import { mediator } from 'mediateur';

import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type ChangementReprésentantLégalCorrigéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalCorrigéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalCorrigéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalCorrigéNotification',
    });
    return;
  }

  const représentantLégal = await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(représentantLégal)) {
    getLogger().error(`Aucun représentant légal n'a été trouvé pour le rappel à 2 mois`, {
      event,
    });
    return;
  }

  if (!représentantLégal.demandeEnCours) {
    getLogger().error(`Aucune demande en cours pour le rappel à 2 mois`, {
      event,
    });
    return;
  }

  const changementReprésentantLégal =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: représentantLégal.demandeEnCours.demandéLe,
      },
    });

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().error(
      `Aucun changement de représentant légal n'a été trouvé pour le rappel à 2 mois`,
      {
        event,
      },
    );
    return;
  }

  return sendEmail({
    templateId: 6656614,
    messageSubject: `Potentiel - Correction de la demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), changementReprésentantLégal.demande.demandéLe.formatter())}`,
    },
  });
};

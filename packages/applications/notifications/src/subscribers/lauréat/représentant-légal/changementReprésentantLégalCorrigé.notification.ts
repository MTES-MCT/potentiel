import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

import { représentantLégalNotificationTemplateId } from './constant';

type ChangementReprésentantLégalCorrigéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
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
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalCorrigéNotification',
    });
    return;
  }

  const changementEnCours =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

  if (Option.isNone(changementEnCours)) {
    getLogger().error('Aucune demande de changement de représentant légal en cours trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalCorrigéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.corriger,
    messageSubject: `Potentiel - Correction de la demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), changementEnCours.demandéLe.formatter())}`,
    },
  });
};

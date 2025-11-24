import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getAppelOffre, getBaseUrl } from '#helpers';

import { lauréatNotificationTemplateId } from '../constant.js';
import { LauréatNotificationsProps } from '../type.js';

export const handleLauréatNotifié = async ({
  sendEmail,
  event: {
    payload: { identifiantProjet },
  },
}: LauréatNotificationsProps<Lauréat.LauréatNotifiéEvent>) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(candidature)) {
    throw new Error(`La candidature n'a pas été trouvée`);
  }

  // gérer le cas du recours accordé
  if (candidature.instruction.statut.estÉliminé()) {
    getLogger('Notifications.handleLauréatNotifié').info(
      `le candidat n'est pas lauréat, pas de notification à envoyer`,
    );
    return;
  }

  const appelOffre = await getAppelOffre(candidature.identifiantProjet.appelOffre);
  const période = appelOffre.periodes.find((p) => p.id === candidature.identifiantProjet.période);
  if (!période) {
    throw new Error(`La période de l'appel d'offre n'a pas été trouvée`);
  }

  const { emailContact, nomReprésentantLégal } = candidature.dépôt;
  await sendEmail({
    templateId: lauréatNotificationTemplateId.projetNotifié,
    recipients: [
      {
        email: emailContact.formatter(),
        fullName: nomReprésentantLégal,
      },
    ],
    messageSubject: `Résultats de la ${période.title} période de l'appel d'offres ${appelOffre.id}`,
    variables: {
      redirect_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
    },
  });
};

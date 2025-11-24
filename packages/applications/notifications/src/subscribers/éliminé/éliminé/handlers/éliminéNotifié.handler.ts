import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getAppelOffre, getBaseUrl } from '#helpers';

import { éliminéNotificationTemplateId } from '../constant.js';
import { ÉliminéNotificationsProps } from '../type.js';

export const handleÉliminéNotifié = async ({
  sendEmail,
  event: {
    payload: { identifiantProjet },
  },
}: ÉliminéNotificationsProps<Éliminé.ÉliminéNotifiéEvent>) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(candidature)) {
    throw new Error(`La candidature n'a pas été trouvée`);
  }

  const appelOffre = await getAppelOffre(candidature.identifiantProjet.appelOffre);
  const période = appelOffre.periodes.find((p) => p.id === candidature.identifiantProjet.période);
  if (!période) {
    throw new Error(`La période de l'appel d'offre n'a pas été trouvée`);
  }

  const { emailContact, nomReprésentantLégal } = candidature.dépôt;
  await sendEmail({
    templateId: éliminéNotificationTemplateId.projetNotifié,
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

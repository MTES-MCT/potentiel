import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getAppelOffre, getBaseUrl } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleLauréatNotifié = async ({
  payload: { identifiantProjet },
}: Lauréat.LauréatNotifiéEvent) => {
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
    key: 'projet/notifier',
    recipients: [
      {
        email: emailContact.formatter(),
        fullName: nomReprésentantLégal,
      },
    ],
    values: {
      appel_offre: candidature.identifiantProjet.appelOffre,
      période: candidature.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
    },
  });
};

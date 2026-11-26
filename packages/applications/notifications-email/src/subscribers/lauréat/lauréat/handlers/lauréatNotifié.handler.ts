import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { buildUrl, getAppelOffre } from '#helpers';
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

  // Recours accordé : pas de notification
  if (candidature.instruction.statut.estÉliminé()) {
    getLogger('Notifications.handleLauréatNotifié').info(
      "le candidat n'est pas lauréat, il n'y a pas de notification à envoyer",
    );
    return;
  }

  const appelOffre = await getAppelOffre(candidature.identifiantProjet.appelOffre);
  const période = appelOffre.periodes.find((p) => p.id === candidature.identifiantProjet.période);

  if (!période) {
    throw new Error(`La période de l'appel d'offre n'a pas été trouvée`);
  }

  const { emailContact } = candidature.dépôt;

  await sendEmail({
    key: 'projet/notifier',
    recipients: [emailContact.formatter()],
    values: {
      nom_projet: candidature.dépôt.nomProjet,
      departement_projet: candidature.dépôt.localité.département,
      appel_offre: appelOffre.id,
      période: période.title,
      url: buildUrl(Routes.Projet.details(identifiantProjet)),
      email_contact: emailContact.formatter(),
    },
  });
};

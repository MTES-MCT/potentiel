import { getBaseUrl } from '@/helpers';

import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { AccèsNotificationsProps } from "../type.js";
import { accèsNotificationTemplateId } from "../constant.js";

export async function handleAccèsProjetRetiré({
  sendEmail,
  candidature: { nom },
  event: {
    payload: { identifiantsUtilisateur, cause },
  },
}: AccèsNotificationsProps<Accès.AccèsProjetRetiréEvent>) {
  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  return sendEmail({
    templateId: accèsNotificationTemplateId.accèsProjetRetiré,
    messageSubject: `Potentiel - Révocation de vos accès pour le projet ${nom}`,
    recipients: identifiantsUtilisateur.map((identifiantUtilisateur) => ({
      email: identifiantUtilisateur,
    })),
    variables: {
      nom_projet: nom,
      mes_projets_url: urlPageProjets,
      cause:
        cause === 'changement-producteur'
          ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
          : '',
    },
  });
}

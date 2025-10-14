import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { getBaseUrl } from '../../helpers';

import { AccèsNotificationsProps } from './type';

export async function accèsProjetRetiréNotification({
  sendEmail,
  projet: { nom },
  event: {
    payload: { identifiantsUtilisateur, cause },
  },
}: AccèsNotificationsProps<Accès.AccèsProjetRetiréEvent>) {
  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  await sendEmail({
    templateId: 4177049,
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

import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';
import { PorteurInvitéEvent } from '@potentiel-domain/utilisateur';

import { getBaseUrl, getCandidature } from '../../helpers';

export const porteurInvitéNotification = async ({
  payload: { identifiantsProjet, identifiantUtilisateur, invitéPar },
}: PorteurInvitéEvent) => {
  const projets = await Promise.all(identifiantsProjet.map(getCandidature));

  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  // On ne notifie pas le porteur invité par le système,
  // car cela correspond à l'invitation liée à la candidature,
  // pour laquelle le porteur est déjà notifié
  if (Email.convertirEnValueType(invitéPar).estÉgaleÀ(Email.system())) {
    return [];
  }

  return [
    {
      templateId: 1402576,
      messageSubject: `Invitation à suivre les projets sur Potentiel`,
      recipients: [{ email: identifiantUtilisateur }],
      variables: {
        nomProjet: projets
          .filter(Boolean)
          .map(({ nom }) => nom)
          .join(', '),
        invitation_link: urlPageProjets,
      },
    },
  ];
};

import { Email } from '@potentiel-domain/common';
import { PorteurInvitéEvent } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { récupérerNomProjet } from './_utils/récupérerNomProjet';

export const porteurInvitéNotification = async ({
  payload: { identifiantsProjet, identifiantUtilisateur, invitéPar },
}: PorteurInvitéEvent) => {
  const nomsProjet = await Promise.all(identifiantsProjet.map(récupérerNomProjet));

  const { BASE_URL } = process.env;
  const urlPageProjets = `${BASE_URL}${Routes.Projet.lister()}`;

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
        nomProjet: nomsProjet.filter(Boolean).join(', '),
        invitation_link: urlPageProjets,
      },
    },
  ];
};

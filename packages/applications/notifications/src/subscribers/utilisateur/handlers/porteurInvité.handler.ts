import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import type { PorteurInvitéEvent } from '@potentiel-domain/utilisateur';

import { buildUrl, getCandidature } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePorteurInvité = async ({
  payload: { identifiantsProjet, identifiantUtilisateur, invitéPar },
}: PorteurInvitéEvent) => {
  const candidatures = await Promise.all(
    identifiantsProjet.map((identifiantProjet) =>
      getCandidature(IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()),
    ),
  );

  // On ne notifie pas le porteur invité par le système,
  // car cela correspond à l'invitation liée à la candidature,
  // pour laquelle le porteur est déjà notifié
  if (Email.convertirEnValueType(invitéPar).estSystème()) {
    return;
  }

  const projets = candidatures.filter(Boolean);

  const tousLesProjets = projets.length > 1;

  const projetALister = projets
    .sort(
      (a, b) =>
        a.appelOffre.localeCompare(b.appelOffre) ||
        Number(a.période) - Number(b.période) ||
        a.nom.localeCompare(b.nom),
    )
    .map(({ identifiantProjet, nom, appelOffre, période }) => ({
      nom,
      appelOffre,
      période,
      url: buildUrl(Routes.Projet.details(identifiantProjet)),
    }));

  await sendEmail({
    key: 'utilisateur/inviter_porteur',
    recipients: [identifiantUtilisateur],
    values: {
      invitéPar,
      tousLesProjets: tousLesProjets ? 'true' : '',
      projetALister,
      url: buildUrl(Routes.Lauréat.lister()),
    },
  });
};

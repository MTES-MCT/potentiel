import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import type { PorteurInvitéEvent } from '@potentiel-domain/utilisateur';

import { buildUrl, getCandidature } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePorteurInvité = async ({
  payload: { identifiantsProjet, identifiantUtilisateur, invitéPar },
}: PorteurInvitéEvent) => {
  const projets = await Promise.all(
    identifiantsProjet.map((identifiantProjet) =>
      getCandidature(IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()),
    ),
  );

  const urlPageProjets = buildUrl(Routes.Lauréat.lister());

  // On ne notifie pas le porteur invité par le système,
  // car cela correspond à l'invitation liée à la candidature,
  // pour laquelle le porteur est déjà notifié
  if (Email.convertirEnValueType(invitéPar).estSystème()) {
    return;
  }

  await sendEmail({
    key: 'utilisateur/inviter_porteur',
    recipients: [identifiantUtilisateur],
    values: {
      nomProjet: projets
        .filter(Boolean)
        .map(({ nom }) => nom)
        .join(', '),
      url: urlPageProjets,
    },
  });
};

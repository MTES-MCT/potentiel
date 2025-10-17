import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { getBaseUrl } from '../../helpers';

export async function utilisateurInvitéNotification({
  payload: { identifiantUtilisateur, rôle },
}: UtilisateurInvitéEvent) {
  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  const templateIds = {
    dreal: 1436254,
    partenaires: 2814281,
  };

  const templateId = match(rôle)
    .returnType<number>()
    .with('dreal', () => templateIds.dreal)
    .with(
      P.union(
        'acheteur-obligé',
        'cocontractant',
        'grd',
        'caisse-des-dépôts',
        'ademe',
        'dgec-validateur',
        'cre',
        'admin',
      ),
      () => templateIds.partenaires,
    )
    .exhaustive();

  return [
    {
      templateId,
      messageSubject: `Invitation à suivre les projets sur Potentiel`,
      recipients: [{ email: identifiantUtilisateur }],
      variables: {
        invitation_link: urlPageProjets,
      },
    },
  ];
}

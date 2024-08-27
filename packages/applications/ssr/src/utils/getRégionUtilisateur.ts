import { mediator } from 'mediateur';

import { ConsulterUtilisateurQuery, Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const getRégionUtilisateur = async ({
  role,
  identifiantUtilisateur,
}: Utilisateur.ValueType) => {
  if (!role.estÉgaleÀ(Role.dreal)) {
    return undefined;
  }
  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur: identifiantUtilisateur.email,
    },
  });

  return Option.isSome(utilisateur) && Option.isSome(utilisateur.régionDreal)
    ? utilisateur.régionDreal
    : undefined;
};

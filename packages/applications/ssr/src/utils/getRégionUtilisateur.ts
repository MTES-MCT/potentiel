import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const getRégionUtilisateur = async ({ role, région }: Utilisateur.ValueType) => {
  if (!role.estÉgaleÀ(Role.dreal)) {
    return undefined;
  }
  if (Option.isSome(région)) {
    return région;
  }
  return '!!RÉGION DREAL MANQUANTE';
};

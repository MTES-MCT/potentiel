import { UtilisateurLegacyReadModel } from '@potentiel/domain-views';
import { User } from '../../../entities';
import { Permission } from '../../authN';
import { convertirEnIdentifiantUtilisateur } from '@potentiel/domain';

export type UtilisateurReadModel = User & { accountUrl: string; permissions: Array<Permission> };

export const convertirEnUtilisateurLegacyReadModel = (
  user: UtilisateurReadModel | undefined,
): Omit<UtilisateurLegacyReadModel, 'type'> | undefined => {
  if (!user) {
    return undefined;
  }

  const { accountUrl, email, fullName, role, fonction } = user;
  return {
    accountUrl,
    email,
    fonction,
    nomComplet: fullName,
    role,
    identifiantUtilisateur: convertirEnIdentifiantUtilisateur(email).formatter(),
  };
};

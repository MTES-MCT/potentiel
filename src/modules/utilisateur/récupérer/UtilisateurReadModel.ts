import { UtilisateurLegacyReadModel } from '@potentiel/domain-views';
import { User } from '../../../entities';
import { Permission } from '../../authN';
import { convertirEnIdentifiantUtilisateur } from '@potentiel/domain-usecases';

export type UtilisateurReadModel = User & { accountUrl: string; permissions: Array<Permission> };

export const convertirEnUtilisateurLegacyReadModel = (
  user: UtilisateurReadModel,
): Omit<UtilisateurLegacyReadModel, 'type'> => {
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

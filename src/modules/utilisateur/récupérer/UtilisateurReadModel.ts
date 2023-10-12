import { UtilisateurLegacyReadModel } from '@potentiel/domain-views';
import { User } from '../../../entities';
import { Permission } from '../../authN';
import { convertirEnIdentifiantUtilisateur } from '@potentiel/domain';

export type UtilisateurReadModel = User & { accountUrl: string; permissions: Array<Permission> };

export const convertirEnUtilisateurLegacyReadModel = ({
  accountUrl,
  email,
  fullName,
  role,
  fonction,
}: UtilisateurReadModel): Omit<UtilisateurLegacyReadModel, 'type'> => ({
  accountUrl,
  email,
  fonction,
  nomComplet: fullName,
  role,
  identifiantUtilisateur: convertirEnIdentifiantUtilisateur(email).formatter(),
});

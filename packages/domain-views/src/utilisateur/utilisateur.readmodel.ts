import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantUtilisateur } from '@potentiel/domain-usecases';

const ROLES = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
] as const;

type Role = (typeof ROLES)[number];

export type UtilisateurLegacyReadModel = ReadModel<
  'utilisateur',
  {
    identifiantUtilisateur: RawIdentifiantUtilisateur;
    role: Role;
    email: string;
    nomComplet: string;
    fonction?: string;
    accountUrl: string;
  }
>;

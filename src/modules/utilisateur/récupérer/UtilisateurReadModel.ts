import { User } from '@entities';
import { Permission } from '@modules/authN';

export type UtilisateurReadModel = User & { accountUrl: string; permissions: Array<Permission> };

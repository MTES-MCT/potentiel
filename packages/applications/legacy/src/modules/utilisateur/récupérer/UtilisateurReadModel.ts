import { User } from '../../../entities';
import { Permission } from '../../authN';

export type UtilisateurReadModel = User & {
  accountUrl?: string;
  permissions: Array<Permission>;
  features: Array<string>;
};

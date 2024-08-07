import { UserRole } from '../../../modules/users';
import { adminActions } from './admin';
import { porteurProjetActions } from './porteurProjet';

export const ACTION_BY_ROLE: Record<UserRole, (project: any) => any[]> = {
  admin: adminActions,
  'dgec-validateur': adminActions,
  'porteur-projet': porteurProjetActions,
  dreal: () => [],
  'acheteur-obligé': () => [],
  ademe: () => [],
  cre: () => [],
  'caisse-des-dépôts': () => [],
};

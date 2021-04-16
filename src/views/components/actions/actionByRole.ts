import { adminActions } from './admin'
import { porteurProjetActions } from './porteurProjet'
import { drealActions } from './dreal'
import { User } from '../../../entities'

export const ACTION_BY_ROLE: Record<User['role'], (project: any) => any[]> = {
  admin: adminActions,
  dgec: adminActions,
  'porteur-projet': porteurProjetActions,
  dreal: drealActions,
  'acheteur-obligé': () => [],
  ademe: () => [],
}

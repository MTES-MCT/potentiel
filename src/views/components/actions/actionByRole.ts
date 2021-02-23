import { adminActions } from './admin'
import { porteurProjetActions } from './porteurProjet'

export const ACTION_BY_ROLE = {
  admin: adminActions,
  dgec: adminActions,
  'porteur-projet': porteurProjetActions,
  dreal: null,
}

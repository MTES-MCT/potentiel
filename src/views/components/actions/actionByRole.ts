import { adminActions } from './admin'
import { porteurProjetActions } from './porteurProjet'
import { drealActions } from './dreal'

export const ACTION_BY_ROLE = {
  admin: adminActions,
  dgec: adminActions,
  'porteur-projet': porteurProjetActions,
  dreal: drealActions,
}

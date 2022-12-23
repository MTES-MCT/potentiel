import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionListerProjets,
  PermissionValiderGF,
  PermissionAnnulerGF,
  PermissionAjouterDateExpirationGF,
} from '@modules/project'
import { UserRole } from '@modules/users'

export type Permission = {
  nom: string
  description: string
}

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> => {
  switch (role) {
    case 'dreal':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionValiderGF,
        PermissionInvaliderGF,
        PermissionAjouterDateExpirationGF,
      ]
    case 'porteur-projet':
    case 'caisse-des-dépôts':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
      ]
    case 'admin':
    case 'dgec-validateur':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionAjouterDateExpirationGF]
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet]
    default:
      return []
  }
}

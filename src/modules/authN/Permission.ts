import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionListerProjets,
  PermissionValiderGF,
  PermissionAnnulerGF,
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
      ]
    case 'porteur-projet':
    case 'caisse-des-dépôts':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionAnnulerGF]
    case 'admin':
    case 'dgec-validateur':
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet]
    default:
      return []
  }
}

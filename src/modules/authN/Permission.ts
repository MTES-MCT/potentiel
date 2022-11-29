import { PermissionConsulterProjet, PermissionListerProjets } from '@modules/project'
import { UserRole } from '@modules/users'

export type Permission = {
  nom: string
  description: string
}

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> => {
  switch (role) {
    case 'dreal':
      return [PermissionListerProjets]
    case 'admin':
    case 'dgec-validateur':
    case 'porteur-projet':
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet]

    default:
      return []
  }
}

import { PermissionListerProjets } from '@modules/project'
import { UserRole } from '@modules/users'

export type Permission = {
  nom: string
  description: string
}

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
    case 'dreal':
    case 'porteur-projet':
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets]

    default:
      return []
  }
}

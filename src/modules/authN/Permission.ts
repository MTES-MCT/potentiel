import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionListerProjets,
  PermissionValiderGF,
  PermissionAnnulerGF,
  PermissionAjouterDateExpirationGF,
  PermissionUploaderGF,
  PermissionRetirerGF,
} from '@modules/project'
import { UserRole } from '@modules/users'
import {
  PermissionConsulterPageInvitationDgecValidateur,
  PermissionInviterDgecValidateur,
} from '@modules/inviterDgecValidateur'

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
        PermissionUploaderGF,
        PermissionRetirerGF,
      ]
    case 'porteur-projet':
    case 'caisse-des-dépôts':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
      ]
    case 'admin':
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionConsulterPageInvitationDgecValidateur,
        PermissionInviterDgecValidateur,
      ]
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet]
    default:
      return []
  }
}

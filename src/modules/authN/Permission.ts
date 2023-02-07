import { UserRole } from '@modules/users'
import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionValiderGF,
  PermissionAnnulerGF,
  PermissionAjouterDateExpirationGF,
  PermissionUploaderGF,
  PermissionRetirerGF,
  PermissionListerProjets,
  PermissionExporterProjets,
} from '@modules/project'
import { PermissionInviterDgecValidateur } from '@modules/utilisateur'

export type Permission = {
  nom: string
  description: string
}

export const PermissionListerDemandesAdmin = {
  nom: 'lister-demandes',
  description: 'Lister les demandes de modification',
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
        PermissionListerDemandesAdmin,
        PermissionExporterProjets,
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
        PermissionExporterProjets,
      ]
    case 'admin':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionInviterDgecValidateur,
        PermissionExporterProjets,
      ]
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionExporterProjets,
      ]
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet, PermissionExporterProjets]
    default:
      return []
  }
}

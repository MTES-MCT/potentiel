import { ResultAsync } from '@core/utils'
import { Permission } from '@modules/authN'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export const PermissionModifierIdentifiantGestionnaireReseau: Permission = {
  nom: 'modifier-identifiant-gestionnaire-reseau',
  description: "Modifier l'identifiant du gestionnaire de réseau",
}

export type ProjectDataForModifierIdentifiantGestionnaireReseauPage = {
  id: string
  nomProjet: string
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  appelOffreId: string
  identifiantGestionnaire?: string
}

export type GetProjectDataForModifierIdentifiantGestionnaireReseauPage = (
  projetId: string
) => ResultAsync<
  ProjectDataForModifierIdentifiantGestionnaireReseauPage,
  EntityNotFoundError | InfraNotAvailableError
>

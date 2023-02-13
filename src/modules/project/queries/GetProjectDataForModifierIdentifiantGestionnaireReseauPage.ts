import { ResultAsync } from '@core/utils'
import { Permission } from '@modules/authN'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export const PermissionModifierIdentifiantGestionnaireReseau: Permission = {
  nom: 'modifier-identifiant-gestionnaire-reseau',
  description: "Modifier l'identifiant du gestionnaire de réseau",
}

export type ProjectDataForModifierIdentifiantGestionnaireReseauPage = {
  id: string
  numeroGestionnaire?: string
}

export type GetProjectDataForModifierIdentifiantGestionnaireReseauPage = (
  projetId: string
) => ResultAsync<
  ProjectDataForModifierIdentifiantGestionnaireReseauPage,
  EntityNotFoundError | InfraNotAvailableError
>

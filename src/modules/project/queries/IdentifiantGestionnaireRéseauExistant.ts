import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

export type IdentifiantGestionnaireRéseauExistant = (
  identifiantGestionnaireRéseau: string
) => ResultAsync<boolean, InfraNotAvailableError>

import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

export type TrouverProjetsParIdentifiantGestionnaireRéseau = (
  identifiantGestionnaireRéseau: string
) => ResultAsync<Array<string>, InfraNotAvailableError>

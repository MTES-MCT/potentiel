import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

export type GetProjetsParIdentifiantGestionnaireRéseau = (
  identifiantsGestionnaireRéseau: Array<string>
) => ResultAsync<Record<string, Array<{ id: string }>>, InfraNotAvailableError>

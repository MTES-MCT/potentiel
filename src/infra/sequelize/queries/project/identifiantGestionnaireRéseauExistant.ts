import { wrapInfra } from '@core/utils'
import { IdentifiantGestionnaireRéseauExistant } from '@modules/project'
import { okAsync } from 'neverthrow'
import models from '../../models'

const { Project } = models

export const identifiantGestionnaireRéseauExistant: IdentifiantGestionnaireRéseauExistant = (
  identifiantGestionnaireRéseau
) =>
  wrapInfra(
    Project.count({
      where: {
        numeroGestionnaire: identifiantGestionnaireRéseau,
      },
    })
  ).andThen((nombreProjet: number) => okAsync(nombreProjet > 0))

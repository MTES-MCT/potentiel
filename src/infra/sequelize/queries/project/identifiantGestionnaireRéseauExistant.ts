import { wrapInfra } from '@core/utils'
import { TrouverProjetsParIdentifiantGestionnaireRéseau } from '@modules/project'
import { okAsync } from 'neverthrow'
import models from '../../models'

const { Project } = models

export const trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau =
  (identifiantGestionnaireRéseau) =>
    wrapInfra(
      Project.findAll({
        attributes: ['id'],
        where: {
          numeroGestionnaire: identifiantGestionnaireRéseau,
        },
      })
    ).andThen((projetIds: Array<string>) => okAsync(projetIds))

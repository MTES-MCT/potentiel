import { GetProjetsParIdentifiantGestionnaireRéseau } from '@modules/imports/donnéesRaccordement'
import { okAsync, wrapInfra } from '@core/utils'
import models from '../../models'
import { Op } from 'sequelize'

const ProjectModel = models.Project

export const getProjetsParIdentifiantGestionnaireRéseau: GetProjetsParIdentifiantGestionnaireRéseau =
  (identifiantsGestionnaireRéseau) => {
    return wrapInfra(
      ProjectModel.findAll({
        where: {
          numeroGestionnaire: {
            [Op.iLike]: { [Op.any]: identifiantsGestionnaireRéseau.map((id) => `%${id}%`) },
          },
        },
        attributes: ['id', 'numeroGestionnaire'],
      })
    ).andThen((projetIds: Array<{ id: string; numeroGestionnaire: string }>) => {
      return okAsync(
        identifiantsGestionnaireRéseau.reduce((acc, identifiantGR) => {
          return {
            ...acc,
            [identifiantGR]: projetIds
              .filter((p) =>
                p.numeroGestionnaire.toLowerCase().includes(identifiantGR.toLowerCase())
              )
              .map(({ id }) => ({ id })),
          }
        }, {})
      )
    })
  }

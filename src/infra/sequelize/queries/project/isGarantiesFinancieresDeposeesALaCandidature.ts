import { IsGarantiesFinancieresDeposeesALaCandidature } from '@modules/project'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import models from '../../models'
import { err, wrapInfra, ok } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'

const { Project } = models

export const isGarantiesFinancieresDeposeesALaCandidature: IsGarantiesFinancieresDeposeesALaCandidature =
  (projectId: string) => {
    return wrapInfra(Project.findByPk(projectId, { attributes: ['appelOffreId'] })).andThen(
      (rawAppelOffreId: any) => {
        if (!rawAppelOffreId) return err(new EntityNotFoundError())
        const { appelOffreId } = rawAppelOffreId.get()
        const appelOffre = appelsOffreStatic.find((ao) => ao.id === appelOffreId)
        if (!appelOffre) return err(new EntityNotFoundError())
        const res = !!appelOffre?.garantiesFinancieresDeposeesALaCandidature
        return ok(res)
      }
    )
  }

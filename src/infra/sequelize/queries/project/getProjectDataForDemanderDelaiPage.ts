import { err, ok, Result, wrapInfra } from '@core/utils'

import { Project } from '@entities'
import {
  GetProjectDataForDemanderDelaiPage,
  getProjectDataForDemanderDelaiPageDTO,
} from '@modules/demandeModification/demandeDélai'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

import models from '../../models'

const { Project } = models

export const getProjectDataForDemanderDelaiPage: GetProjectDataForDemanderDelaiPage = (projectId) =>
  wrapInfra(Project.findByPk(projectId)).andThen(
    (projectRaw: any): Result<getProjectDataForDemanderDelaiPageDTO, EntityNotFoundError> => {
      if (!projectRaw) return err(new EntityNotFoundError())
      return ok(projectRaw.get())
    }
  )

import { Repository, UniqueEntityID } from '../../../core/domain'
import { err, errAsync, logger, ok, okAsync, wrapInfra } from '../../../core/utils'
import { ProjectAdmissionKey } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export const makeProjectAdmissionKeyRepo = (models: any): Repository<ProjectAdmissionKey> => {
  const { ProjectAdmissionKey } = models

  return {
    save(projectAdmissionKey: ProjectAdmissionKey) {
      if (!ProjectAdmissionKey) return errAsync(new InfraNotAvailableError())

      return wrapInfra(ProjectAdmissionKey.upsert(projectAdmissionKey))
    },

    load(id: UniqueEntityID) {
      return wrapInfra(ProjectAdmissionKey.findByPk(id.toString())).andThen(
        (projectAdmissionKeyRaw: any) => {
          if (!projectAdmissionKeyRaw) return err(new EntityNotFoundError())

          return ok(projectAdmissionKeyRaw.get() as ProjectAdmissionKey)
        }
      )
    },
  }
}

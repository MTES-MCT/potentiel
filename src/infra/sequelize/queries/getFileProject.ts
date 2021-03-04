import { UniqueEntityID } from '../../../core/domain'
import { err, errAsync, ok, wrapInfra } from '../../../core/utils'
import { FileNotFoundError, GetFileProject } from '../../../modules/file'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetFileProject = (models): GetFileProject => (fileId: UniqueEntityID) => {
  const FileModel = models.File
  if (!FileModel) return errAsync(new InfraNotAvailableError())

  return wrapInfra(FileModel.findByPk(fileId.toString())).andThen((file: any) => {
    if (!file) return err(new FileNotFoundError())

    if (file.forProject) return ok(new UniqueEntityID(file.forProject))

    return ok(null)
  })
}

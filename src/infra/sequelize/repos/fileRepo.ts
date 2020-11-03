import { Repository, DomainError, UniqueEntityID } from '../../../core/domain'
import { Result, ResultAsync, errAsync, err } from '../../../core/utils'
import { File } from '../../../modules/file'
import { InfraNotAvailableError, EntityNotFoundError } from '../../../modules/shared'

export class FileRepo implements Repository<File> {
  private models: any

  constructor(models: any) {
    this.models = models
  }

  private toDomain(db: any): Result<File, DomainError> {
    return File.create(
      {
        filename: db.filename,
        forProject: db.forProject || undefined,
        createdBy: db.createdBy || undefined,
        createdAt: db.createdAt,
        designation: db.designation,
        storedAt: db.storedAt,
      },
      new UniqueEntityID(db.id)
    )
  }

  private toPersistence(file: File): any {
    return {
      id: file.id.toString(),
      filename: file.filename,
      forProject: file.forProject,
      createdBy: file.createdBy,
      createdAt: file.createdAt || new Date(),
      designation: file.designation,
      storedAt: file.storedAt,
    }
  }

  save(aggregate: File): ResultAsync<null, InfraNotAvailableError> {
    const FileModel = this.models.File
    if (!FileModel) return errAsync(new InfraNotAvailableError())

    return ResultAsync.fromPromise<null, DomainError>(
      FileModel.create(this.toPersistence(aggregate)),
      (e: any) => {
        console.error('fileRepo.save error', e)
        return new InfraNotAvailableError()
      }
    )
  }

  load(id: UniqueEntityID): ResultAsync<File, EntityNotFoundError | InfraNotAvailableError> {
    const FileModel = this.models.File
    if (!FileModel) return errAsync(new InfraNotAvailableError())

    return ResultAsync.fromPromise<File, DomainError>(
      FileModel.findByPk(id.toString()),
      (e: any) => {
        console.error('fileRepo.load error', e)
        return new InfraNotAvailableError()
      }
    ).andThen((dbResult) => (dbResult ? this.toDomain(dbResult) : err(new EntityNotFoundError())))
  }
}

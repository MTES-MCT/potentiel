import { Repository, UniqueEntityID } from '../../core/domain'
import { DomainError } from '../../core/domain/DomainError'
import { err, errAsync, ok, Result, ResultAsync } from '../../core/utils'
import { User } from '../../entities'
import { ShouldUserAccessProject } from '../authorization'
import { OtherError } from '../shared'
import { FileAccessDeniedError, FileNotFoundError } from './errors'
import { File } from './File'
import { FileContainer, FileStorageService } from './FileStorageService'

export class FileService {
  constructor(
    private fileStorageService: FileStorageService,
    private fileRepo: Repository<File>,
    private shouldUserAccessProject: ShouldUserAccessProject
  ) {}

  save(file: File, fileContent: FileContainer): ResultAsync<null, DomainError> {
    return this.fileStorageService.save(fileContent).andThen((fileStorageIdentifier: string) => {
      file.registerStorage(fileStorageIdentifier)
      return this.fileRepo.save(file)
    })
  }

  load(fileId: string, user: User) {
    return this.fileRepo
      .load(new UniqueEntityID(fileId))
      .andThen((file: File) =>
        file.forProject
          ? ResultAsync.fromPromise(
              this.shouldUserAccessProject.check({
                user,
                projectId: file.forProject,
              }),
              (e: any) => new OtherError(e.message)
            ).andThen(
              (userHasAccess): Result<File, FileAccessDeniedError> =>
                userHasAccess ? ok(file) : err(new FileAccessDeniedError())
            )
          : ok<File, DomainError>(file)
      )
      .andThen(
        (file: File): ResultAsync<FileContainer, FileNotFoundError> =>
          file.storedAt
            ? this.fileStorageService.load(file.storedAt).mapErr((e) => new FileNotFoundError())
            : errAsync(new FileNotFoundError())
      )
  }
}

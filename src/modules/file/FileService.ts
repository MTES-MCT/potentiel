import { FileStorageService, FileContainer } from './FileStorageService'
import { FileAccessDeniedError, FileNotFoundError } from './errors'
import { OtherError } from '../shared'
import { File } from './File'
import { User } from '../../entities'
import { Repository, UniqueEntityID } from '../../core/domain'
import { ResultAsync, ok, err } from '../../core/utils'
import { ShouldUserAccessProject } from '../authorization'
import { DomainError } from '../../core/domain/DomainError'

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

  load(fileId: string, user: User): ResultAsync<FileContainer, DomainError> {
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
            ).andThen((userHasAccess) =>
              userHasAccess ? ok(file) : err(new FileAccessDeniedError())
            )
          : ok(file)
      )
      .andThen((file: File) =>
        file.storedAt ? this.fileStorageService.load(file.storedAt) : err(new FileNotFoundError())
      )
  }
}

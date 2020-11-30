import { Repository } from '../../../core/domain'
import { FileObject, FileObjectArgs, makeFileObject } from '../FileObject'

/**
 * Builds a file, saves it using the repo and returns the id
 * @param args.file: the arguments for makeFileObject
 * @param args.fileRepo: the file repository
 * @returns ResultAsync<string = fileId, IllegalFileDataError, InfraNotAvailableError>
 */
export const makeAndSaveFile = (args: { file: FileObjectArgs; fileRepo: Repository<FileObject> }) =>
  makeFileObject(args.file).asyncAndThen((file) =>
    args.fileRepo.save(file).map(() => file.id.toString())
  )

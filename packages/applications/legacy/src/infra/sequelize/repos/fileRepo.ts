import { Repository, UniqueEntityID } from '../../../core/domain';
import { errAsync, logger, wrapInfra } from '../../../core/utils';
import {
  FileContents,
  FileObject,
  FileStorageService,
  makeFileObject,
} from '../../../modules/file';
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared';
import { File } from '../projectionsNext';

interface FileRepoDeps {
  fileStorageService: FileStorageService;
}

export const makeFileRepo = (deps: FileRepoDeps): Repository<FileObject> => {
  return {
    save(file: FileObject) {
      if (!File) return errAsync(new InfraNotAvailableError());

      const { contents, path } = file;
      return deps.fileStorageService.upload({ contents, path }).andThen((storedAt) => {
        return wrapInfra(File.create(_toPersistence(file, storedAt))).map(() => null);
      });
    },

    load(id: UniqueEntityID) {
      return wrapInfra(File.findByPk(id.toString())).andThen((fileRaw: any) => {
        if (!fileRaw) return errAsync(new EntityNotFoundError());

        const file = fileRaw.get();

        return deps.fileStorageService
          .download(file.storedAt)
          .andThen((contents) => _toDomain(file, contents))
          .mapErr((e: Error) => {
            logger.error(e);
            return new InfraNotAvailableError();
          });
      });
    },
  };

  function _toDomain(file: any, contents: FileContents) {
    const { id, filename, forProject, createdBy, createdAt, designation } = file;
    return makeFileObject({
      id: new UniqueEntityID(id),
      filename,
      forProject: forProject ? new UniqueEntityID(forProject) : undefined,
      createdBy: createdBy ? new UniqueEntityID(createdBy) : undefined,
      createdAt,
      designation,
      contents,
    });
  }

  function _toPersistence(file: FileObject, storedAt: string): any {
    return {
      id: file.id.toString(),
      filename: file.filename,
      forProject: file.forProject?.toString(),
      createdBy: file.createdBy?.toString(),
      createdAt: file.createdAt,
      designation: file.designation,
      storedAt: storedAt,
    };
  }
};

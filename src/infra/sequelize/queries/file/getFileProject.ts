import { UniqueEntityID } from '../../../../core/domain';
import { err, ok, wrapInfra } from '../../../../core/utils';
import { FileNotFoundError, GetFileProject } from '../../../../modules/file';
import { File } from "../../projectionsNext";

export const getFileProject: GetFileProject = (fileId: UniqueEntityID) => {
  return wrapInfra(File.findByPk(fileId.toString())).andThen((file: any) => {
    if (!file) return err(new FileNotFoundError());

    if (file.forProject) return ok(new UniqueEntityID(file.forProject));

    return ok(null);
  });
};

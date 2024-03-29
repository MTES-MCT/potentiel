import { EventBus, Repository, UniqueEntityID } from '../../../core/domain';
import { User } from '../../../entities';
import { FileObject, makeFileObject } from '../../file';
import { LegacyModificationFileAttached } from '../events/LegacyModificationFileAttached';

interface AttachLegacyModificationFileDeps {
  eventBus: EventBus;
  fileRepo: Repository<FileObject>;
  getLegacyModificationByFilename: (filename: string) => Promise<string[]>;
}

interface AttachLegacyModificationFileArgs {
  filename: string;
  contents: NodeJS.ReadableStream;
  attachedBy: User;
}

export const makeAttachLegacyModificationFile =
  ({ eventBus, fileRepo, getLegacyModificationByFilename }: AttachLegacyModificationFileDeps) =>
  async ({ filename, contents, attachedBy }: AttachLegacyModificationFileArgs): Promise<void> => {
    const projectIds = await getLegacyModificationByFilename(filename);
    if (projectIds.length === 0) {
      throw new Error('Pas de modification historique trouvée avec ce nom de fichier.');
    }

    for (const projectId of projectIds) {
      const fileIdResult = await makeFileObject({
        designation: 'courrier-modification-historique',
        forProject: new UniqueEntityID(projectId),
        createdBy: new UniqueEntityID(attachedBy.id),
        filename,
        contents,
      }).asyncAndThen((file) => {
        return fileRepo.save(file).map((): string => file.id.toString());
      });

      if (fileIdResult.isErr()) {
        throw new Error('Impossible de sauvegarder le fichier');
      }

      const fileId = fileIdResult.value;
      const res = await eventBus.publish(
        new LegacyModificationFileAttached({
          payload: {
            fileId,
            filename,
            projectId,
          },
        }),
      );

      if (res.isErr()) {
        throw new Error("Impossible d'associer ce fichier à la demande correspondante.");
      }
    }
  };

import { UniqueEntityID } from '@core/domain';
import { ProjectDCRSubmitted } from '@modules/project';
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model';
import { logger } from '@core/utils';
import { File } from '@infra/sequelize/projectionsNext';

export default ProjectEventProjector.on(
  ProjectDCRSubmitted,
  async ({ payload: { projectId, fileId, dcrDate }, occurredAt }, transaction) => {
    const { File } = models;
  async ({ payload: { projectId, fileId, dcrDate, numeroDossier }, occurredAt }, transaction) => {
    const rawFilename = await File.findOne({
      attributes: ['filename'],
      where: { id: fileId },
      transaction,
    });
    if (!rawFilename) {
      logger.error(
        `Error : impossible de trouver le fichier (id = ${fileId}) d'attestation DCR pour le project ${projectId})`,
      );
    }
    const filename: string | undefined = rawFilename?.filename;
    const file = filename && { id: fileId, name: filename };
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRSubmitted.type,
        valueDate: dcrDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { ...(file && { file }) },
      },
      { transaction },
    );
  },
);

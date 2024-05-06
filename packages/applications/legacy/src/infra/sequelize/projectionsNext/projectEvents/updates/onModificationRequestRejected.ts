import { Transaction } from 'sequelize';
import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { ModificationRequestRejected } from '../../../../../modules/modificationRequest';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { File } from '../../file/file.model';
import { ModificationRequest } from '../../modificationRequest/modificationRequest.model';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ModificationRequestRejected,
  async (évènement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, rejectedBy },
      occurredAt,
    } = évènement;

    const demandeDélai = await ProjectEvent.findOne({
      where: { id: modificationRequestId, type: 'DemandeDélai' },
      transaction,
    });

    if (demandeDélai) {
      try {
        await ProjectEvent.update(
          {
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            payload: {
              //@ts-ignore
              ...demandeDélai.payload,
              statut: 'rejetée',
              rejetéPar: rejectedBy,
            },
          },
          { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction },
        );
        return;
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestRejected`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onModificationRequestRejected',
            },
            e,
          ),
        );
      }
    } else {
      const modificationRequest = await ModificationRequest.findByPk(modificationRequestId, {
        attributes: ['projectId'],
        transaction,
      });

      if (modificationRequest) {
        const { projectId } = modificationRequest;

        const file = responseFileId && (await getFile(responseFileId, transaction));

        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestRejected',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            id: new UniqueEntityID().toString(),
            payload: { modificationRequestId, ...(file && { file }) },
          },
          { transaction },
        );
      }
    }
  },
);

const getFile = async (responseFileId: string, transaction: Transaction | undefined) => {
  const rawFilename = await File.findByPk(responseFileId, {
    attributes: ['filename'],
    transaction,
  });

  const file = rawFilename ? { id: responseFileId, name: rawFilename.filename } : undefined;

  return file;
};

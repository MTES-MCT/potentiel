import { UniqueEntityID } from '@core/domain';
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model';
import { ModificationRequest } from '../../modificationRequest/modificationRequest.model';

export default ProjectEventProjector.on(
  ModificationRequestInstructionStarted,
  async (évènement, transaction) => {
    const {
      payload: { modificationRequestId },
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
              statut: 'en-instruction',
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

        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestInstructionStarted',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            id: new UniqueEntityID().toString(),
            payload: { modificationRequestId },
          },
          { transaction },
        );
      }
    }
  },
);

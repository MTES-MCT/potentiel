import { UniqueEntityID } from '@core/domain';
import { ModificationRequestCancelled } from '@modules/modificationRequest';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model';
import { ModificationRequest } from '../../modificationRequest/modificationRequest.model';

export default ProjectEventProjector.on(
  ModificationRequestCancelled,
  async (évènement, transaction) => {
    const {
      payload: { modificationRequestId, cancelledBy },
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
              statut: 'annulée',
              annuléPar: cancelledBy,
            },
          },
          { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction },
        );
        return;
      } catch (e) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestCancelled`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onModificationRequestCancelled',
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
            type: 'ModificationRequestCancelled',
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

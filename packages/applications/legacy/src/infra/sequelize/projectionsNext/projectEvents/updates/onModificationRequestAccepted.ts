import { Transaction } from 'sequelize';
import { File, ModificationRequest } from '../..';
import { UniqueEntityID } from '../../../../../core/domain';
import { logger } from '../../../../../core/utils';
import { ModificationRequestAccepted } from '../../../../../modules/modificationRequest';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  ModificationRequestAccepted,
  async (évènement, transaction) => {
    const {
      payload: { modificationRequestId, responseFileId, acceptedBy, params },
      occurredAt,
    } = évènement;

    if (params?.type === 'delai') {
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
                statut: 'accordée',
                accordéPar: acceptedBy,
                délaiEnMoisAccordé: params.delayInMonths,
              },
            },
            { where: { id: modificationRequestId, type: 'DemandeDélai' }, transaction },
          );
        } catch (e) {
          logger.error(
            new ProjectionEnEchec(
              `Erreur lors du traitement de l'événement ModificationRequestAccepted : mise à jour DemandeDélai`,
              {
                évènement,
                nomProjection: 'ProjectEvent.onModificationRequestAccepted',
              },
              e,
            ),
          );
        }
        return;
      }
    }

    const modificationRequest = await ModificationRequest.findByPk(modificationRequestId, {
      attributes: ['projectId'],
      transaction,
    });

    if (modificationRequest) {
      const { projectId } = modificationRequest;
      const file = responseFileId && (await getFile(responseFileId, transaction));

      try {
        await ProjectEvent.create(
          {
            projectId,
            type: 'ModificationRequestAccepted',
            valueDate: occurredAt.getTime(),
            eventPublishedAt: occurredAt.getTime(),
            id: new UniqueEntityID().toString(),
            payload: { modificationRequestId, ...(file && { file }) },
          },
          { transaction },
        );
      } catch (error) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ModificationRequestAccepted : ajout de ModificationRequestAccepted`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onModificationRequestAccepted',
            },
            error,
          ),
        );
      }

      if (params?.type === 'recours') {
        try {
          await ProjectEvent.create(
            {
              projectId,
              type: 'DateMiseEnService',
              valueDate: occurredAt.getTime(),
              eventPublishedAt: occurredAt.getTime(),
              id: new UniqueEntityID().toString(),
              payload: { statut: 'non-renseignée' },
            },
            { transaction },
          );
        } catch (error) {
          logger.error(
            new ProjectionEnEchec(
              `Erreur lors du traitement de l'événement ModificationRequestAccepted : ajout de DateMiseEnService`,
              {
                évènement,
                nomProjection: 'ProjectEvent.onModificationRequestAccepted',
              },
              error,
            ),
          );
        }
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

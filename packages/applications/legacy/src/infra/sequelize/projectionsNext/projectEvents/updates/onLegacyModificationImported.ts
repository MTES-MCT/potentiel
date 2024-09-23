import { LegacyModificationImported } from '../../../../../modules/modificationRequest';
import { UniqueEntityID } from '../../../../../core/domain';
import { ProjectEvent } from '../projectEvent.model';
import { ProjectEventProjector } from '../projectEvent.projector';

export default ProjectEventProjector.on(
  LegacyModificationImported,
  async ({ payload: { projectId, modifications }, occurredAt }, transaction) => {
    await ProjectEvent.destroy({
      where: { projectId, type: 'LegacyModificationImported' },
      transaction,
    });

    for (const modification of modifications) {
      const common = {
        id: new UniqueEntityID().toString(),
        projectId,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: modification.modifiedOn,
        type: 'LegacyModificationImported',
      };
      const filename = modification.filename;
      const status = modification.status;
      switch (modification.type) {
        case 'delai':
          if (status === 'acceptée') {
            await ProjectEvent.create(
              {
                ...common,
                payload: {
                  modificationType: 'delai',
                  status,
                  ancienneDateLimiteAchevement: modification.ancienneDateLimiteAchevement,
                  nouvelleDateLimiteAchevement: modification.nouvelleDateLimiteAchevement,
                  ...(filename && { filename }),
                },
              },
              { transaction },
            );
          } else {
            await ProjectEvent.create(
              {
                ...common,
                payload: {
                  modificationType: 'delai',
                  status,
                  ...(filename && { filename }),
                },
              },
              { transaction },
            );
          }
          break;
        case 'actionnaire':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'actionnaire',
                actionnairePrecedent: modification.actionnairePrecedent,
                ...(filename && { filename }),
                status,
              },
            },
            { transaction },
          );
          break;
        case 'producteur':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'producteur',
                producteurPrecedent: modification.producteurPrecedent,
                ...(filename && { filename }),
                status,
              },
            },
            { transaction },
          );
          break;
        case 'autre':
          await ProjectEvent.create(
            {
              ...common,
              payload: {
                modificationType: 'autre',
                column: modification.column,
                value: modification.value,
                ...(filename && { filename }),
                status,
              },
            },
            { transaction },
          );
          break;
      }
    }
  },
);

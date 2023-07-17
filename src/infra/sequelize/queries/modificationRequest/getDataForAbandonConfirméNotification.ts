import { err, ok, wrapInfra } from '@core/utils';
import { GetDataForAbandonConfirméNotification } from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';
import { ModificationRequest, Project, User } from '@infra/sequelize/projectionsNext';

export const getDataForAbandonConfirméNotification: GetDataForAbandonConfirméNotification = (
  modificationRequestId: string,
) => {
  return wrapInfra(
    ModificationRequest.findByPk(modificationRequestId, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['nomProjet', 'appelOffreId', 'periodeId'],
        },
        {
          model: User,
          as: 'confirmationRequestedByUser',
          attributes: ['fullName', 'email', 'id'],
        },
      ],
    }),
  ).andThen((modificationRequestRaw: any) => {
    if (!modificationRequestRaw) return err(new EntityNotFoundError());

    const {
      confirmationRequestedByUser: { email, fullName, id },
      project: { nomProjet, appelOffreId, periodeId },
    } = modificationRequestRaw.get();

    return ok({
      nomProjet,
      appelOffreId,
      périodeId: periodeId,
      chargeAffaire: { id, email, fullName },
    });
  });
};

import { err, ok, wrapInfra } from '@core/utils';
import { ModificationRequest } from '../../projectionsNext/modificationRequest';
import {
  GetModificationRequestInfoForConfirmedNotification,
  ModificationRequestInfoForConfirmedNotificationDTO,
} from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';
import { Project, User } from '@infra/sequelize/projectionsNext';

export const getModificationRequestInfoForConfirmedNotification: GetModificationRequestInfoForConfirmedNotification =
  (modificationRequestId: string) => {
    return wrapInfra(
      ModificationRequest.findByPk(modificationRequestId, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['nomProjet'],
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
        type,
        confirmationRequestedByUser: { email, fullName, id },
        project: { nomProjet },
      } = modificationRequestRaw.get();

      return ok({
        type,
        nomProjet,
        chargeAffaire: { id, email, fullName },
      } as ModificationRequestInfoForConfirmedNotificationDTO);
    });
  };

import { err, ok, wrapInfra } from '@core/utils';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';
import { ModificationRequest, Project, User } from '@infra/sequelize/projectionsNext';

export const getDataForStatutDemandeAbandonModifiéNotification: GetDataForStatutDemandeAbandonModifiéNotification =
  (modificationRequestId: string) => {
    return wrapInfra(
      ModificationRequest.findByPk(modificationRequestId, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['nomProjet', 'appelOffreId', 'periodeId', 'departementProjet'],
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
        confirmationRequestedByUser,
        project: { nomProjet, appelOffreId, periodeId, departementProjet },
      } = modificationRequestRaw.get();

      return ok({
        nomProjet,
        appelOffreId,
        périodeId: periodeId,
        départementProjet: departementProjet,
        ...(confirmationRequestedByUser && {
          chargeAffaire: {
            id: confirmationRequestedByUser.id,
            email: confirmationRequestedByUser.email,
            fullName: confirmationRequestedByUser.fullName,
          },
        }),
      });
    });
  };

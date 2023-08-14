import { err, wrapInfra } from '../../../../core/utils';
import { GetDataForStatutDemandeAbandonModifiéNotification } from '../../../../modules/modificationRequest';
import { EntityNotFoundError } from '../../../../modules/shared';
import {
  ModificationRequest,
  Project,
  User,
  UserProjects,
} from "../../projectionsNext";

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
      if (!modificationRequestRaw) {
        return err(new EntityNotFoundError());
      }

      const {
        confirmationRequestedByUser,
        projectId,
        project: { nomProjet, appelOffreId, periodeId, departementProjet },
      } = modificationRequestRaw.get();

      return wrapInfra(
        UserProjects.findAll({
          attributes: ['projectId'],
          where: { projectId },
          include: [{ model: User, as: 'user', attributes: ['fullName', 'email', 'id'] }],
        }),
      ).map((porteursProjet) => ({
        nomProjet,
        appelOffreId,
        périodeId: periodeId,
        départementProjet: departementProjet,
        porteursProjet: porteursProjet.map(({ user: { id, email, fullName } }) => ({
          id,
          email,
          fullName,
        })),
        ...(confirmationRequestedByUser && {
          chargeAffaire: {
            id: confirmationRequestedByUser.id,
            email: confirmationRequestedByUser.email,
            fullName: confirmationRequestedByUser.fullName,
          },
        }),
      }));
    });
  };

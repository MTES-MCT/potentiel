import { NotificationService } from '..';
import { ProjectRepo, UserRepo } from '../../../dataAccess';
import routes from '../../../routes';
import { logger } from '../../../core/utils';
import { ProjectGFUploaded } from '../../project';

export const handleProjectGFUploaded =
  (deps: {
    sendNotification: NotificationService['sendNotification'];
    findUsersForDreal: UserRepo['findUsersForDreal'];
    findUserById: UserRepo['findById'];
    findProjectById: ProjectRepo['findById'];
  }) =>
  async (event: ProjectGFUploaded) => {
    const { projectId } = event.payload;

    const project = await deps.findProjectById(projectId);

    if (!project) {
      logger.error(new Error('handleProjectGFUploaded failed because project is not found'));
      return;
    }
    const regions = project.regionProjet.split(' / ');
    await Promise.all(
      regions.map(async (region) => {
        const drealUsers = await deps.findUsersForDreal(region);
        await Promise.all(
          drealUsers.map((drealUser) =>
            deps.sendNotification({
              type: 'dreal-gf-enregistrée-notification',
              message: {
                email: drealUser.email,
                name: drealUser.fullName,
                subject: `Potentiel - Garanties financières enregistrées pour un projet dans le département ${project.departementProjet}`,
              },
              context: {
                projectId: project.id,
                dreal: region,
                userId: drealUser.id,
              },
              variables: {
                nomProjet: project.nomProjet,
                departementProjet: project.departementProjet,
                invitation_link: routes.PROJECT_DETAILS(projectId),
              },
            }),
          ),
        );
      }),
    );
  };

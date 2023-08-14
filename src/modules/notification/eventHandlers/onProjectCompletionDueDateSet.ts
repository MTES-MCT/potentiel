import { logger } from '../../../core/utils';
import { ProjectRepo, UserRepo } from '../../../dataAccess';
import {
  ProjectCompletionDueDateSet,
  RécupérerDonnéesPorteursParProjetQueryHandler,
} from "../../project";
import routes from '../../../routes';
import { NotificationService } from '../NotificationService';

type OnProjectCompletionDueDateSet = (évènement: ProjectCompletionDueDateSet) => Promise<void>;

type MakeOnProjectCompletionDueDateSet = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getProjectUsers: RécupérerDonnéesPorteursParProjetQueryHandler;
  getProjectById: ProjectRepo['findById'];
  findUsersForDreal: UserRepo['findUsersForDreal'];
}) => OnProjectCompletionDueDateSet;

export const makeOnProjectCompletionDueDateSet: MakeOnProjectCompletionDueDateSet =
  ({ sendNotification, getProjectUsers, getProjectById, findUsersForDreal }) =>
  async ({ payload: { projectId, reason } }) => {
    if (reason !== 'délaiCdc2022') {
      return;
    }

    const projet = await getProjectById(projectId);
    if (!projet) {
      logger.error(
        `Notification handler onProjectCompletionDueDateSet pour délai CDC 2022: projet ${projectId} non trouvé.`,
      );
      return;
    }
    const porteursEmails = await getProjectUsers({ projetId: projectId });

    await Promise.all(
      porteursEmails.map(({ email, fullName, id }) =>
        sendNotification({
          type: 'pp-delai-cdc-2022-appliqué',
          context: { projetId: projectId, utilisateurId: id },
          variables: {
            nom_projet: projet.nomProjet,
            projet_url: routes.PROJECT_DETAILS(projectId),
          },
          message: {
            email,
            name: fullName,
            subject: `Potentiel - Nouveau délai appliqué pour votre projet ${projet.nomProjet}`,
          },
        }),
      ),
    );

    const regions = projet.regionProjet.split(' / ');
    await Promise.all(
      regions.map(async (region) => {
        const dreals = await findUsersForDreal(region);
        Promise.all(
          dreals.map(({ email, fullName, id }) =>
            sendNotification({
              type: 'dreals-delai-cdc-2022-appliqué',
              context: { projetId: projectId, utilisateurId: id },
              variables: {
                nom_projet: projet.nomProjet,
                projet_url: routes.PROJECT_DETAILS(projectId),
              },
              message: {
                email,
                name: fullName,
                subject: `Potentiel - Nouveau délai appliqué pour le projet ${projet.nomProjet}`,
              },
            }),
          ),
        );
      }),
    );
  };

import { logger } from '../../../core/utils';
import { ProjectRepo, UserRepo } from '../../../dataAccess';
import {
  ProjectCompletionDueDateSet,
  RécupérerDonnéesPorteursParProjetQueryHandler,
} from '../../project';
import routes from '../../../routes';
import { NotificationService } from '../NotificationService';

type OnProjectCompletionDueDateSet = (évènement: ProjectCompletionDueDateSet) => Promise<void>;

type MakeOnProjectCompletionDueDateSet = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getProjectUsers: RécupérerDonnéesPorteursParProjetQueryHandler;
  getProjectById: ProjectRepo['findById'];
  findUsersForDreal: UserRepo['findUsersForDreal'];
  dgecEmail: string;
}) => OnProjectCompletionDueDateSet;

export const makeOnProjectCompletionDueDateSet: MakeOnProjectCompletionDueDateSet =
  ({ sendNotification, getProjectUsers, getProjectById, findUsersForDreal, dgecEmail }) =>
  async ({ payload: { projectId, reason } }) => {
    const projet = await getProjectById(projectId);
    if (!projet) {
      logger.error(
        `Notification handler onProjectCompletionDueDateSet pour délai CDC 2022: projet ${projectId} non trouvé.`,
      );
      return;
    }

    const porteursEmails = await getProjectUsers({ projetId: projectId });
    const regions = projet.regionProjet.split(' / ');

    if (reason === 'délaiCdc2022') {
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
      return;
    }

    if (
      reason &&
      [
        'DateMiseEnServiceAnnuleDélaiCdc2022',
        'ChoixCDCAnnuleDélaiCdc2022',
        'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
      ].includes(reason)
    ) {
      const variables = {
        nom_projet: projet.nomProjet,
        projet_url: routes.PROJECT_DETAILS(projectId),
      };
      const type =
        reason === 'DateMiseEnServiceAnnuleDélaiCdc2022'
          ? 'date-mise-en-service-transmise-annule-delai-cdc-2022'
          : reason === 'ChoixCDCAnnuleDélaiCdc2022'
          ? 'changement-cdc-annule-delai-cdc-2022'
          : 'demande-complete-raccordement-transmise-annule-delai-Cdc-2022';

      await Promise.all(
        porteursEmails.map(({ email, fullName, id }) =>
          sendNotification({
            type,
            context: { projetId: projectId, utilisateurId: id },
            variables,
            message: {
              email,
              name: fullName,
              subject: `Potentiel - Date d'achèvement théorique mise à jour pour le projet ${projet.nomProjet}`,
            },
          }),
        ),
      );

      await Promise.all(
        regions.map(async (region) => {
          const dreals = await findUsersForDreal(region);
          Promise.all(
            dreals.map(({ email, fullName, id }) =>
              sendNotification({
                type,
                context: { projetId: projectId, utilisateurId: id },
                variables,
                message: {
                  email,
                  name: fullName,
                  subject: `Potentiel - Date d'achèvement théorique mise à jour pour le projet ${projet.nomProjet}`,
                },
              }),
            ),
          );
        }),
      );

      if (reason === 'DateMiseEnServiceAnnuleDélaiCdc2022') {
        await sendNotification({
          type,
          context: { projetId: projectId, utilisateurId: '' },
          variables,
          message: {
            email: dgecEmail,
            name: 'DGEC',
            subject: `Potentiel - Date d'achèvement théorique mise à jour pour le projet ${projet.nomProjet}`,
          },
        });
      }
    }
  };

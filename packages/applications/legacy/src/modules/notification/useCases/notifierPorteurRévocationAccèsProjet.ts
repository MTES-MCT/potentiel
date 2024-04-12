import routes from '../../../routes';
import { NotificationService } from '../NotificationService';

export type NotifierPorteurRévocationAccèsProjet = (args: {
  email: string;
  nomPorteur: string;
  nomProjet: string;
  porteurId: string;
  projetId: string;
  cause?: 'changement producteur';
}) => Promise<null>;

export type MakeNotifierPorteurRévocationAccèsProjet = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
}) => NotifierPorteurRévocationAccèsProjet;

export const makeNotifierPorteurRévocationAccèsProjet: MakeNotifierPorteurRévocationAccèsProjet =
  ({ sendNotification }) =>
  async ({ email, nomPorteur, nomProjet, porteurId, projetId, cause }) => {
    return sendNotification({
      type: 'accès-utilisateur-révoqués',
      message: {
        email,
        name: nomPorteur,
        subject: `Révocation de vos accès pour le projet ${nomProjet}`,
      },
      context: {
        projetId,
        utilisateurId: porteurId,
      },
      variables: {
        nom_projet: nomProjet,
        mes_projets_url: routes.LISTE_PROJETS,
        cause:
          cause === 'changement producteur'
            ? 'Cela fait suite à un changement de producteur déclaré sur Potentiel.'
            : undefined,
      },
    });
  };

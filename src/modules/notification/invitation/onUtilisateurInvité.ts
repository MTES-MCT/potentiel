import routes from '../../../routes';
import { NotificationService } from '../NotificationService';
import { UtilisateurInvité } from '../../utilisateur';

type Dépendances = {
  sendNotification: NotificationService['sendNotification'];
};

export const onUtilisateurInvité =
  ({ sendNotification }: Dépendances) =>
  async (évènement: UtilisateurInvité) => {
    const { email } = évènement.payload;

    await sendNotification({
      type: 'user-invitation',
      message: {
        email,
        subject: 'Invitation sur Potentiel',
      },
      context: {},
      variables: {
        invitation_link: `${routes.SIGNUP}?email=${email}`,
      },
    });
  };

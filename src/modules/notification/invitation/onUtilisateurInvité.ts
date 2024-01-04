import { NotificationService } from '../NotificationService';
import { UtilisateurInvité } from '../../utilisateur';
import { GET_SENREGISTRER } from '@potentiel/legacy-routes';

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
        invitation_link: `${GET_SENREGISTRER}?email=${email}`,
      },
    });
  };

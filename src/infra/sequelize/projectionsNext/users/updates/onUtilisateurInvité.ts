import { User, UserProjector } from '../users.model';
import { UtilisateurInvité } from '@modules/utilisateur';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export default UserProjector.on(UtilisateurInvité, async (évènement, transaction) => {
  const { payload } = évènement;
  const { email, role } = payload;

  try {
    await User.create(
      {
        email,
        role,
        état: 'invité',
        ...(role === 'dgec-validateur' && { fonction: payload.fonction }),
      },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UtilisateurInvité`,
        {
          évènement,
          nomProjection: 'Users.UtilisateurInvité',
        },
        error,
      ),
    );
  }
});

import { User } from '../users.model';
import { UserProjector } from '../user.projector';
import { logger } from '../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { UtilisateurDésactivé } from '../../../../../modules/users';

export default UserProjector.on(UtilisateurDésactivé, async (évènement, transaction) => {
  const {
    payload: { userId },
  } = évènement;
  try {
    await User.update(
      {
        disabled: true,
      },
      {
        where: { id: userId },
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UtilisateurDésactivé`,
        {
          évènement,
          nomProjection: 'Users.UtilisateurDésactivé',
        },
        error,
      ),
    );
  }
});

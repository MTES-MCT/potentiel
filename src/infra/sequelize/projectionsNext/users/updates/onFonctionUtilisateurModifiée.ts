import { Users, UsersProjector } from '../users.model';
import { FonctionUtilisateurModifiée } from '@modules/users';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export default UsersProjector.on(FonctionUtilisateurModifiée, async (évènement, transaction) => {
  const {
    payload: { userId, fonction },
  } = évènement;
  try {
    await Users.update(
      {
        fonction,
      },
      {
        where: { id: userId },
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement FonctionUtilisateurModifiée`,
        {
          évènement,
          nomProjection: 'Users.FonctionUtilisateurModifiée',
        },
        error,
      ),
    );
  }
});

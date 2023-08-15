import { User } from '../users.model';
import { UserProjector } from '../user.projector';
import { RôleUtilisateurModifié } from '../../../../../modules/users';
import { logger } from '../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../modules/shared';

export default UserProjector.on(RôleUtilisateurModifié, async (évènement, transaction) => {
  const {
    payload: { userId, role },
  } = évènement;
  try {
    await User.update(
      {
        role,
      },
      {
        where: { id: userId },
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement RôleUtilisateurModifié`,
        {
          évènement,
          nomProjection: 'Users.RôleUtilisateurModifié',
        },
        error,
      ),
    );
  }
});

import { User } from '../users.model';
import { UserProjector } from '../user.projector';
import { UserCreated } from '../../../../../modules/users';
import { logger } from '../../../../../core/utils';
import { ProjectionEnEchec } from '../../../../../modules/shared';
import { convertirEnIdentifiantUtilisateur } from '@potentiel/domain';

export default UserProjector.on(UserCreated, async (évènement, transaction) => {
  const {
    payload: { userId, email, role, fullName },
  } = évènement;
  try {
    await User.create(
      {
        id: userId,
        email,
        role,
        fullName,
        hash: convertirEnIdentifiantUtilisateur(email).hash(),
      },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement UserCreated`,
        {
          évènement,
          nomProjection: 'Users.UserCreated',
        },
        error,
      ),
    );
  }
});

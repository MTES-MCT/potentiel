import { User } from '../users.model';
import { UserProjector } from '../user.projector';
import { ProfilUtilisateurCréé } from '@modules/utilisateur';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export default UserProjector.on(ProfilUtilisateurCréé, async (évènement, transaction) => {
  const {
    payload: { email, role, prénom, nom, fonction },
  } = évènement;
  const utilisateurExistant = await User.findOne({ where: { email }, transaction });
  try {
    await User.upsert(
      {
        ...(utilisateurExistant && { id: utilisateurExistant.id }),
        email,
        role,
        fullName: `${prénom} ${nom}`,
        fonction,
        état: 'créé',
      },
      {
        transaction,
      },
    );
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProfilUtilisateurCréé`,
        {
          évènement,
          nomProjection: 'Users.ProfilUtilisateurCréé',
        },
        error,
      ),
    );
  }
});

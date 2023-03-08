import { logger } from '@core/utils';
import { DrealUserInvited } from '@modules/authZ';
import { ProjectionEnEchec } from '@modules/shared';
import { UserDreal } from '../userDreal.model';
import { UserDrealProjector } from '../userDreal.projector';

export default UserDrealProjector.on(DrealUserInvited, async (évènement, transaction) => {
  const {
    payload: { region: dreal, userId },
  } = évènement;

  try {
    await UserDreal.create({ dreal, userId }, { transaction });
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement DrealUserInvited`,
        {
          évènement,
          nomProjection: 'UserDreal.DrealUserInvited',
        },
        error,
      ),
    );
  }
});

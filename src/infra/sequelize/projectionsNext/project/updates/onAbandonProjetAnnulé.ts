import { logger } from '@core/utils';
import { AbandonProjetAnnulé } from '@modules/project';
import { ProjectionEnEchec } from '@modules/shared';

export const onAbandonProjetAnnulé = (models) => async (évènement: AbandonProjetAnnulé) => {
  const {
    payload: { dateAchèvement, dateLimiteEnvoiDcr, projetId },
  } = évènement;

  const { Project } = models;

  const instanceDuProjet = await Project.findByPk(évènement.payload.projetId);

  if (!instanceDuProjet) {
    logger.error(
      `Error: onAbandonProjetAnnulé n'a pas pu retrouver le projet pour l'évènement : ${évènement}`,
    );
    return;
  }

  try {
    await Project.update(
      {
        abandonedOn: 0,
        ...(dateLimiteEnvoiDcr && {
          dcrDueOn: dateLimiteEnvoiDcr.getTime(),
        }),
        completionDueOn: dateAchèvement.getTime(),
      },
      { where: { id: projetId } },
    );
  } catch (cause) {
    logger.error(
      new ProjectionEnEchec(
        'Erreur lors de la mise à jour du projet',
        {
          nomProjection: 'onAbandonProjetAnnulé',
          évènement,
        },
        cause,
      ),
    );
  }
};

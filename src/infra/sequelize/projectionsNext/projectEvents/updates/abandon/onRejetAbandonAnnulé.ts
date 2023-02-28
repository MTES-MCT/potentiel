import { logger } from '@core/utils';
import { RejetAbandonAnnulé } from '@modules/demandeModification';
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model';
import { ProjectionEnEchec } from '../../../../../../modules/shared';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';

export default ProjectEventProjector.on(RejetAbandonAnnulé, async (évènement, transaction) => {
  const { demandeAbandonId } = évènement.payload;

  const demandeAbandonInstance = await ProjectEvent.findOne({
    where: { id: demandeAbandonId, type: 'DemandeAbandon' },
    transaction,
  });

  if (demandeAbandonInstance) {
    const rawRequestedOn = await ModificationRequest.findOne({
      attributes: ['requestedOn'],
      where: { id: demandeAbandonId },
      transaction,
    });

    if (!rawRequestedOn) {
      logger.error(
        new ProjectionEnEchec('Impossible de trouver la modificationRequest pour la demande', {
          nomProjection: 'onRejetAbandonAnnulé',
          évènement,
        }),
      );
      return;
    }

    try {
      await ProjectEvent.update(
        {
          valueDate: rawRequestedOn.requestedOn,
          eventPublishedAt: rawRequestedOn.requestedOn,
          payload: { ...demandeAbandonInstance.payload, statut: 'envoyée' },
        },
        { where: { id: demandeAbandonId, type: 'DemandeAbandon' }, transaction },
      );
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          'ProjectionEnEchec',
          {
            nomProjection: 'onRejetAbandonAnnulé',
            évènement,
          },
          e,
        ),
      );
    }
  }
});

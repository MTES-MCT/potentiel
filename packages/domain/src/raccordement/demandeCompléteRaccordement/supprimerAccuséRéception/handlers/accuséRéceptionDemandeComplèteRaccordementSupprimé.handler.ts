import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from '../accuséRéceptionDemandeComplèteRaccordementSupprimé.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement';
import { isNone } from '@potentiel/monads';

export type AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies = {
  update: Update;
  find: Find;
};

/**
 * @deprecated
 */
export const accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent,
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies
> =
  ({ update, find }) =>
  async ({ payload: { référenceDossierRaccordement, identifiantProjet } }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${identifiantProjet}#${référenceDossierRaccordement}`,
    );

    if (isNone(dossierRaccordement)) {
      // TODO : ajouter une erreur ?
    } else {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${identifiantProjet}#${référenceDossierRaccordement}`,
        {
          ...dossierRaccordement,
          accuséRéception: undefined,
        },
      );
    }
  };

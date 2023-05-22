import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';

export type AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies = {
  update: Update;
  find: Find;
};

/**
 * @deprecated
 */
export const accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
  AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies
> =
  ({ update, find }) =>
  async ({ payload: { format, référenceDossierRaccordement, identifiantProjet } }) => {
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
          accuséRéception: {
            format,
          },
        },
      );
    }
  };

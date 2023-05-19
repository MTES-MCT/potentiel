import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/dossierRaccordement.readModel';

export type AccuséRéceptionDemandeComplèteRaccordementTransmiseDependencies = {
  update: Update;
  find: Find;
};

export const accuséRéceptionDemandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
  AccuséRéceptionDemandeComplèteRaccordementTransmiseDependencies
> =
  ({ update, find }) =>
  async ({ payload: { format, référence: référenceDossierRaccordement, identifiantProjet } }) => {
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

import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../accuséRéceptionDemandeComplèteRaccordementTransmis.event';

export const accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
  {
    update: Update;
    find: Find;
  }
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

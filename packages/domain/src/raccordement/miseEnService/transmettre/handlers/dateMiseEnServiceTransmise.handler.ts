import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DateMiseEnServiceTransmiseEvent } from '../dateMiseEnServiceTransmise.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';

export type DateMiseEnServiceTransmiseDependencies = {
  find: Find;
  update: Update;
};

/**
 * @deprecated
 */
export const dateMiseEnServiceTransmiseHandlerFactory: DomainEventHandlerFactory<
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseDependencies
> =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
    );

    if (isSome(dossierRaccordement)) {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
        {
          ...dossierRaccordement,
          dateMiseEnService: event.payload.dateMiseEnService,
        },
      );
    } else {
      // TODO add a log here
    }
  };

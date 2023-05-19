import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DateMiseEnServiceTransmiseEvent } from '../dateMiseEnServiceTransmise.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';

export type DateMiseEnServiceTransmiseHandlerFactory = {
  find: Find;
  update: Update;
};

/**
 * @deprecated
 */
export const dateMiseEnServiceTransmiseHandlerFactory: DomainEventHandlerFactory<
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseHandlerFactory
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

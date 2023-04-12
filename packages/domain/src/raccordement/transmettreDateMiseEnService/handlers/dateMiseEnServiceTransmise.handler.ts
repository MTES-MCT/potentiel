import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { DateMiseEnServiceTransmiseEvent } from '../dateMiseEnServiceTransmise.event';

export const dateMiseEnServiceTransmiseHandlerFactory: DomainEventHandlerFactory<
  DateMiseEnServiceTransmiseEvent,
  {
    find: Find;
    update: Update;
  }
> =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.référenceDossierRaccordement}`,
    );

    if (isSome(dossierRaccordement)) {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.référenceDossierRaccordement}`,
        {
          ...dossierRaccordement,
          dateMiseEnService: event.payload.dateMiseEnService,
        },
      );
    }
  };

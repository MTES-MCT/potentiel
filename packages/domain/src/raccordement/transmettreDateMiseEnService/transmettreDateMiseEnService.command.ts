import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { DateMiseEnServiceTransmiseEvent } from './dateMiseEnServiceTransmise.event';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type TransmettrePropositionTechniqueEtFinancièreCommand = {
  dateMiseEnService: Date;
  référenceDossierRaccordement: string;
  identifiantProjet: IdentifiantProjet;
};

export const transmettreDateMiseEnServiceCommandHandlerFactory: CommandHandlerFactory<
  TransmettrePropositionTechniqueEtFinancièreCommand,
  Dependencies
> =
  ({ loadAggregate, publish }) =>
  async ({ dateMiseEnService, référenceDossierRaccordement, identifiantProjet }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement)) {
      throw new Error("Le projet n'a aucun dossier de raccordement");
    }

    if (!raccordement.références.includes(référenceDossierRaccordement)) {
      throw new Error("Le dossier de raccordement n'est pas référencé");
    }

    const event: DateMiseEnServiceTransmiseEvent = {
      type: 'DateMiseEnServiceTransmise',
      payload: {
        dateMiseEnService: dateMiseEnService.toISOString(),
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

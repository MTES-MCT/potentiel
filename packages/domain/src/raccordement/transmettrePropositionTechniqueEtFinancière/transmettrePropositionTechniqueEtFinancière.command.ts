import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './propositionTechniqueEtFinancièreTransmise.event';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';
import { AucunDossierRaccordementError } from '../transmettreDateMiseEnService/aucunDossierRaccordement.error';
import { DossierRaccordementNonRéférencéError } from '../transmettreDateMiseEnService/dossierRaccordementNonRéférencé.error';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type TransmettrePropositionTechniqueEtFinancièreCommand = {
  dateSignature: Date;
  référenceDossierRaccordement: string;
  identifiantProjet: IdentifiantProjet;
};

export const transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  TransmettrePropositionTechniqueEtFinancièreCommand,
  Dependencies
> =
  ({ publish, loadAggregate }) =>
  async ({ dateSignature, référenceDossierRaccordement, identifiantProjet }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement)) {
      throw new AucunDossierRaccordementError();
    }

    if (!raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: PropositionTechniqueEtFinancièreTransmiseEvent = {
      type: 'PropositionTechniqueEtFinancièreTransmise',
      payload: {
        dateSignature: dateSignature.toISOString(),
        référenceDossierRaccordement,
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

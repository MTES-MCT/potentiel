import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './propositionTechniqueEtFinancièreTransmise.event';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { Readable } from 'stream';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type TransmettrePropositionTechniqueEtFinancièreCommand = {
  dateSignature: Date;
  référenceDossierRaccordement: string;
  identifiantProjet: IdentifiantProjet;
  propositionTechniqueEtFinancière: {
    format: string;
    content: Readable;
  };
};

export const transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  TransmettrePropositionTechniqueEtFinancièreCommand,
  Dependencies
> =
  ({ publish, loadAggregate }) =>
  async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    propositionTechniqueEtFinancière: { format, content },
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreTransmiseEvent: PropositionTechniqueEtFinancièreTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreTransmise',
        payload: {
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement,
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreTransmiseEvent,
    );

    const fichierPropositionTechniqueEtFinancièreTransmisEvent = {
      type: 'FichierPropositionTechniqueEtFinancièreTransmis',
      payload: {
        identifiantProjet,
        format,
        référenceDossierRaccordement,
      },
    };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      fichierPropositionTechniqueEtFinancièreTransmisEvent,
    );
  };

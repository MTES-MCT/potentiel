import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import {
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '../../../projet/valueType/identifiantProjet';
import { PropositionTechniqueEtFinancièreSignéeSuppriméeEvent } from './propositionTechniqueEtFinancièreSignéeSupprimée.event';

export type SupprimerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'SUPPRIMER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    propositionTechniqueEtFinancière: { format: string };
  }
>;

export type SupprimerPropositionTechniqueEtFinancièreSignéeDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const registerSupprimerPropositionTechniqueEtFinancièreSignéeCommand = ({
  loadAggregate,
  publish,
}: SupprimerPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<SupprimerPropositionTechniqueEtFinancièreSignéeCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancière: { format },
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: PropositionTechniqueEtFinancièreSignéeSuppriméeEvent = {
      type: 'PropositionTechniqueEtFinancièreSignéeSupprimée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement,
        format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

  mediator.register('SUPPRIMER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND', handler);
};

export const buildSupprimerPropositionTechniqueEtFinancièreSignéeCommand =
  getMessageBuilder<SupprimerPropositionTechniqueEtFinancièreSignéeCommand>(
    'SUPPRIMER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  );

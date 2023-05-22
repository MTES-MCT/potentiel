import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './PropositionTechniqueEtFinancièreModifiée.event';
import { isNone } from '@potentiel/monads';
import { Readable } from 'stream';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
  PropositionTechniqueEtFinancièreSignéeTransmiseEvent,
} from '../transmettre';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND = Symbol(
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
);

type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  typeof MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND,
  {
    identifiantProjet: IdentifiantProjet;
    dateSignature: Date;
    référence: string;
    nouveauFichier: { format: string; content: Readable };
  }
>;

export type ModifierPropositionTechniqueEtFinancièreDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerFichierPropositionTechniqueEtFinancière: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
};

export const registerModifierPropositionTechniqueEtFinancièreCommand = ({
  publish,
  loadAggregate,
  enregistrerFichierPropositionTechniqueEtFinancière,
}: ModifierPropositionTechniqueEtFinancièreDependencies) => {
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreCommand> = async ({
    identifiantProjet,
    référence,
    dateSignature,
    nouveauFichier: { format, content },
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référence)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreModifiéeEvent: PropositionTechniqueEtFinancièreModifiéeEvent =
      {
        type: 'PropositionTechniqueEtFinancièreModifiée',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement: référence,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreModifiéeEvent,
    );

    const fichierPropositionTechniqueEtFinancièreTransmisEvent: PropositionTechniqueEtFinancièreSignéeTransmiseEvent =
      {
        type: 'FichierPropositionTechniqueEtFinancièreTransmis',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          référenceDossierRaccordement: référence,
          format,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      fichierPropositionTechniqueEtFinancièreTransmisEvent,
    );

    await enregistrerFichierPropositionTechniqueEtFinancière({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      référence,
      format,
      content,
    });
  };

  mediator.register(MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND, handler);
};

export const buildModifierPropositionTechniqueEtFinancièreCommand =
  getMessageBuilder<ModifierPropositionTechniqueEtFinancièreCommand>(
    MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND,
  );

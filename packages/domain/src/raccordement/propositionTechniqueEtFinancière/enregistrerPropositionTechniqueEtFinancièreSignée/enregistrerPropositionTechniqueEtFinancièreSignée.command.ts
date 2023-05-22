import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from './propositionTechniqueEtFinancièreSignéeTransmise.event';

const ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND = Symbol(
  'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
);

export type EnregistrerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  typeof ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND,
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    propositionTechniqueEtFinancière: { format: string; content: Readable };
  }
>;

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
  content: Readable;
}) => Promise<void>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
};

export const registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand = ({
  publish,
  loadAggregate,
  enregistrerPropositionTechniqueEtFinancièreSignée,
}: EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<EnregistrerPropositionTechniqueEtFinancièreSignéeCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancière: { format, content },
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    await enregistrerPropositionTechniqueEtFinancièreSignée({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      content,
      format,
      référenceDossierRaccordement,
    });

    const fichierPropositionTechniqueEtFinancièreTransmisEvent: PropositionTechniqueEtFinancièreSignéeTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          format,
          référenceDossierRaccordement,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      fichierPropositionTechniqueEtFinancièreTransmisEvent,
    );
  };

  mediator.register(ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND, handler);
};

export const buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand =
  getMessageBuilder<EnregistrerPropositionTechniqueEtFinancièreSignéeCommand>(
    ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND,
  );

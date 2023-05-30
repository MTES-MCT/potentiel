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

export type EnregistrerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    anciennePropositionTechniqueEtFinancière?: { format: string; content: Readable };
    nouvellePropositionTechniqueEtFinancière: { format: string; content: Readable };
  }
>;

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (
  args:
    | {
        opération: 'création';
        identifiantProjet: string;
        référenceDossierRaccordement: string;
        nouveauFichier: {
          format: string;
          content: Readable;
        };
      }
    | {
        opération: 'modification';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        nouvelleRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouveauFichier: { format: string; content: Readable };
      },
) => Promise<void>;

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
    anciennePropositionTechniqueEtFinancière,
    nouvellePropositionTechniqueEtFinancière,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (anciennePropositionTechniqueEtFinancière) {
      await enregistrerPropositionTechniqueEtFinancièreSignée({
        opération: 'modification',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        ancienFichier: anciennePropositionTechniqueEtFinancière,
        nouveauFichier: nouvellePropositionTechniqueEtFinancière,
        ancienneRéférenceDossierRaccordement: référenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement: référenceDossierRaccordement,
      });
    } else {
      await enregistrerPropositionTechniqueEtFinancièreSignée({
        opération: 'création',
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        nouveauFichier: nouvellePropositionTechniqueEtFinancière,
        référenceDossierRaccordement,
      });
    }

    const fichierPropositionTechniqueEtFinancièreTransmisEvent: PropositionTechniqueEtFinancièreSignéeTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          format: nouvellePropositionTechniqueEtFinancière.format,
          référenceDossierRaccordement,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      fichierPropositionTechniqueEtFinancièreTransmisEvent,
    );
  };

  mediator.register('ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND', handler);
};

export const buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand =
  getMessageBuilder<EnregistrerPropositionTechniqueEtFinancièreSignéeCommand>(
    'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  );

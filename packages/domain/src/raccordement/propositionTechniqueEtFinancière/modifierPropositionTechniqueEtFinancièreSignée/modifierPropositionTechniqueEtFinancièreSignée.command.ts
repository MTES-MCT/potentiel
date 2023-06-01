import { Readable } from 'stream';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish } from '@potentiel/core-domain';
import { createRaccordementAggregateId } from '../../raccordement.aggregate';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '../enregistrerPropositionTechniqueEtFinancièreSignée/propositionTechniqueEtFinancièreSignéeTransmise.event';

export type ModifierPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    anciennePropositionTechniqueEtFinancière: { format: string; content: Readable };
    nouvellePropositionTechniqueEtFinancière: { format: string; content: Readable };
  }
>;

export type ModifierPropositionTechniqueEtFinancièreSignéePort = (
  args:
    | {
        opération: 'modification';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        nouvelleRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouveauFichier: { format: string; content: Readable };
      }
    | {
        opération: 'déplacement-fichier';
        identifiantProjet: string;
        ancienneRéférenceDossierRaccordement: string;
        ancienFichier: { format: string; content: Readable };
        nouvelleRéférenceDossierRaccordement: string;
        nouveauFichier: { format: string; content: Readable };
      },
) => Promise<void>;

export type ModifierPropositionTechniqueEtFinancièreSignéeDependencies = {
  publish: Publish;
  enregistrerPropositionTechniqueEtFinancièreSignée: ModifierPropositionTechniqueEtFinancièreSignéePort;
};

export const registerModifierPropositionTechniqueEtFinancièreSignéeCommand = ({
  publish,
  enregistrerPropositionTechniqueEtFinancièreSignée,
}: ModifierPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreSignéeCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    anciennePropositionTechniqueEtFinancière,
    nouvellePropositionTechniqueEtFinancière,
  }) => {
    await enregistrerPropositionTechniqueEtFinancièreSignée({
      opération: 'modification',
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      ancienFichier: anciennePropositionTechniqueEtFinancière,
      nouveauFichier: nouvellePropositionTechniqueEtFinancière,
      ancienneRéférenceDossierRaccordement: référenceDossierRaccordement,
      nouvelleRéférenceDossierRaccordement: référenceDossierRaccordement,
    });

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

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND', handler);
};

export const buildModifierPropositionTechniqueEtFinancièreSignéeCommand =
  getMessageBuilder<ModifierPropositionTechniqueEtFinancièreSignéeCommand>(
    'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  );

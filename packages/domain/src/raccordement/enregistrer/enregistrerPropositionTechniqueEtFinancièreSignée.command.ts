import { Readable } from 'stream';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish } from '@potentiel/core-domain';
import { createRaccordementAggregateId } from '../raccordement.aggregate';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet/projet.valueType';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '../raccordement.event';

export type EnregistrerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    anciennePropositionTechniqueEtFinancière?: { format: string; content: Readable };
    nouvellePropositionTechniqueEtFinancière: { format: string; content: Readable };
  }
>;

export type EnregistrerPropositionTechniqueEtFinancièreSignéePort = (args: {
  opération: 'création';
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  nouveauFichier: {
    format: string;
    content: Readable;
  };
}) => Promise<void>;

export type EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies = {
  publish: Publish;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
};

export const registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand = ({
  publish,
  enregistrerPropositionTechniqueEtFinancièreSignée,
}: EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const handler: MessageHandler<EnregistrerPropositionTechniqueEtFinancièreSignéeCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    nouvellePropositionTechniqueEtFinancière,
  }) => {
    await enregistrerPropositionTechniqueEtFinancièreSignée({
      opération: 'création',
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      nouveauFichier: nouvellePropositionTechniqueEtFinancière,
      référenceDossierRaccordement,
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

  mediator.register('ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND', handler);
};

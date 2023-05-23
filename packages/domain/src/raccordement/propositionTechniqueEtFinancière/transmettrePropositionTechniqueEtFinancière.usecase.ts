import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import {
  TransmettrePropositionTechniqueEtFinancièreCommand,
  buildTransmettrePropositionTechniqueEtFinancièreCommand,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
  buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
} from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';

export type TransmettrePropositionTechniqueEtFinancièreUseCase = Message<
  'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  TransmettrePropositionTechniqueEtFinancièreCommand['data'] &
    EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data']
>;

export const registerTransmettrePropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<TransmettrePropositionTechniqueEtFinancièreUseCase> = async ({
    dateSignature,
    identifiantProjet,
    propositionTechniqueEtFinancière,
    référenceDossierRaccordement,
  }) => {
    await mediator.send(
      buildTransmettrePropositionTechniqueEtFinancièreCommand({
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand({
        identifiantProjet,
        propositionTechniqueEtFinancière,
        référenceDossierRaccordement,
      }),
    );
  };
  mediator.register('TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

export const buildTransmettrePropositionTechniqueEtFinancièreUseCase =
  getMessageBuilder<TransmettrePropositionTechniqueEtFinancièreUseCase>(
    'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  );

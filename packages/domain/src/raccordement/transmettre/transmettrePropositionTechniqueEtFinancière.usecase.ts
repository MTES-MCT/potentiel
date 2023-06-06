import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière.command';
import { EnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from '../enregistrer/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { RaccordementCommand } from '../raccordement.command';

export type TransmettrePropositionTechniqueEtFinancièreUseCase = Message<
  'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  TransmettrePropositionTechniqueEtFinancièreCommand['data'] &
    Pick<
      EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data'],
      'nouvellePropositionTechniqueEtFinancière'
    >
>;

export const registerTransmettrePropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<TransmettrePropositionTechniqueEtFinancièreUseCase> = async ({
    dateSignature,
    identifiantProjet,
    nouvellePropositionTechniqueEtFinancière,
    référenceDossierRaccordement,
  }) => {
    await mediator.send<RaccordementCommand>({
      type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });

    await mediator.send<RaccordementCommand>({
      type: 'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
      data: {
        identifiantProjet,
        nouvellePropositionTechniqueEtFinancière,
        référenceDossierRaccordement,
      },
    });
  };

  mediator.register('TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

export const buildTransmettrePropositionTechniqueEtFinancièreUseCase =
  getMessageBuilder<TransmettrePropositionTechniqueEtFinancièreUseCase>(
    'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  );

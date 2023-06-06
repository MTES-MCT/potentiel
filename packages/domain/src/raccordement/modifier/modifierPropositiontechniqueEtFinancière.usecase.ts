import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from '../enregistrer/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { ModifierPropositionTechniqueEtFinancièreCommand } from './modifierPropositiontechniqueEtFinancière.command';
import { RaccordementCommand } from '../raccordement.command';

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  ModifierPropositionTechniqueEtFinancièreCommand['data'] &
    Pick<
      EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data'],
      'propositionTechniqueEtFinancièreSignée'
    >
>;

export const registerModifierPropositiontechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositiontechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancièreSignée,
  }) => {
    await mediator.send<RaccordementCommand>({
      type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
      data: {
        identifiantProjet,
        dateSignature,
        référenceDossierRaccordement,
      },
    });

    await mediator.send<RaccordementCommand>({
      type: 'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
      data: {
        identifiantProjet,
        propositionTechniqueEtFinancièreSignée,
        référenceDossierRaccordement,
      },
    });
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

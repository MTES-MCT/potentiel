import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import {
  ModifierPropositionTechniqueEtFinancièreCommand,
  buildModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
  buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
} from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { buildSupprimerPropositionTechniqueEtFinancièreSignéeCommand } from './supprimerPropositionTechniqueEtFinancièreSignée/supprimerPropositionTechniqueEtFinancièreSignée.command';

const MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE = Symbol(
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
);

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  typeof MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE,
  ModifierPropositionTechniqueEtFinancièreCommand['data'] &
    EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data']
>;

export const registerModifierPropositiontechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositiontechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancière,
  }) => {
    await mediator.send(
      buildSupprimerPropositionTechniqueEtFinancièreSignéeCommand({
        identifiantProjet,
        référenceDossierRaccordement,
        propositionTechniqueEtFinancière,
      }),
    );
    await mediator.send(
      buildModifierPropositionTechniqueEtFinancièreCommand({
        identifiantProjet,
        dateSignature,
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

  mediator.register(MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE, runner);
};

export const buildModifierPropositiontechniqueEtFinancièreUseCase =
  getMessageBuilder<ModifierPropositiontechniqueEtFinancièreUseCase>(
    MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE,
  );

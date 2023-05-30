import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
  buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
} from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import {
  ModifierPropositionTechniqueEtFinancièreCommand,
  buildModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { buildConsulterPropositionTechniqueEtFinancièreSignéeQuery } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  ModifierPropositionTechniqueEtFinancièreCommand['data'] &
    Pick<
      EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data'],
      'nouvellePropositionTechniqueEtFinancière'
    >
>;

export const registerModifierPropositiontechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositiontechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    nouvellePropositionTechniqueEtFinancière,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: référenceDossierRaccordement,
      }),
    );

    const anciennePropositionTechniqueEtFinancière = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreSignéeQuery({
        référenceDossierRaccordement,
        identifiantProjet,
        format: dossierRaccordement.accuséRéception?.format || '',
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
        référenceDossierRaccordement,
        anciennePropositionTechniqueEtFinancière,
        nouvellePropositionTechniqueEtFinancière,
      }),
    );
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

export const buildModifierPropositiontechniqueEtFinancièreUseCase =
  getMessageBuilder<ModifierPropositiontechniqueEtFinancièreUseCase>(
    'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  );

import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import {
  ModifierPropositionTechniqueEtFinancièreCommand,
  buildModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { buildConsulterPropositionTechniqueEtFinancièreSignéeQuery } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import {
  ModifierPropositionTechniqueEtFinancièreSignéeCommand,
  buildModifierPropositionTechniqueEtFinancièreSignéeCommand,
} from './modifierPropositionTechniqueEtFinancièreSignée/modifierPropositionTechniqueEtFinancièreSignée.command';
import { FichierInexistant } from '@potentiel/file-storage';

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  ModifierPropositionTechniqueEtFinancièreCommand['data'] &
    Pick<
      ModifierPropositionTechniqueEtFinancièreSignéeCommand['data'],
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

    await mediator.send(
      buildModifierPropositionTechniqueEtFinancièreCommand({
        identifiantProjet,
        dateSignature,
        référenceDossierRaccordement,
      }),
    );

    const anciennePropositionTechniqueEtFinancière = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreSignéeQuery({
        référenceDossierRaccordement,
        identifiantProjet,
        format: dossierRaccordement.accuséRéception?.format || '',
      }),
    );

    if (!anciennePropositionTechniqueEtFinancière) {
      throw new FichierInexistant();
    }

    await mediator.send(
      buildModifierPropositionTechniqueEtFinancièreSignéeCommand({
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

import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatPropositionTechniqueEtFinancièreSignée: string;
  }
>;

export const registerModifierPropositionTechniqueEtFinancièreCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    formatPropositionTechniqueEtFinancièreSignée,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    await raccordement.modifierPropositionTechniqueEtFinancière({
      dateSignature,
      formatPropositionTechniqueEtFinancièreSignée,
      identifiantProjet,
      référenceDossierRaccordement,
    });
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND', handler);
};

import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot } from '../../../..';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatPropositionTechniqueEtFinancièreSignée: string;
  }
>;

export const registerModifierPropositionTechniqueEtFinancièreCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreCommand> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    formatPropositionTechniqueEtFinancièreSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierPropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      formatPropositionTechniqueEtFinancièreSignée,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
    handler,
  );
};

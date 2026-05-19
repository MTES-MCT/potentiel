import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    propositionTechniqueEtFinancièreSignée: { format: string };
    estUnNouveauDocument: boolean;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierPropositionTechniqueEtFinancièreCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreCommand> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancièreSignée,
    estUnNouveauDocument,
    rôle,
    modifiéeLe,
    modifiéePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierPropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      propositionTechniqueEtFinancièreSignée,
      estUnNouveauDocument,
      rôle,
      modifiéeLe,
      modifiéePar,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
    handler,
  );
};

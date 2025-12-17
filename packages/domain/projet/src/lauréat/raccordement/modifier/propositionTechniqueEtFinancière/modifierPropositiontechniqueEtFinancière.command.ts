import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatPropositionTechniqueEtFinancièreSignée: string;
    rôle: Role.ValueType;
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
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierPropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      formatPropositionTechniqueEtFinancièreSignée,
      rôle,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
    handler,
  );
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot } from '../../../..';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierRéférenceDossierRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async (options) => {
    const projet = await getProjetAggregateRoot(options.identifiantProjet);

    // pas besoin du gestionnaire ici, on va ajouter la référence
    const gestionnaireRéseau = await loadGestionnaireRéseau(
      raccordement.identifiantGestionnaireRéseau,
    );

    await projet.lauréat.raccordement.modifierRéférenceDossierRacordement({
      nouvelleRéférenceDossierRaccordement,
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      référenceDossierRaccordementActuelle,
      modifiéeLe,
      modifiéePar,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement', handler);
};

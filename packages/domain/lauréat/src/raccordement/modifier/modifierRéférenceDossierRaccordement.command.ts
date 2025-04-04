import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

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
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordementActuelle,
    nouvelleRéférenceDossierRaccordement,
    modifiéeLe,
    modifiéePar,
    rôle,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    const gestionnaireRéseau = await loadGestionnaireRéseau(
      raccordement.identifiantGestionnaireRéseau,
    );

    await raccordement.modifierRéférenceDossierRacordement({
      identifiantProjet,
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

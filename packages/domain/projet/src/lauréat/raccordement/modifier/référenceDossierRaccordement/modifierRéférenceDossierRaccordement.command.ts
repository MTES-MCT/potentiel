import { Message, MessageHandler, mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

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
  loadAggregate: LoadAggregate,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    modifiéeLe,
    modifiéePar,
    rôle,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    const gestionnaireRéseau = await loadGestionnaireRéseau(
      projet.lauréat.raccordement.identifiantGestionnaireRéseau,
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

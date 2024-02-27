import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'Réseau.Raccordement.Command.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerModifierRéférenceDossierRaccordementCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordementActuelle,
    nouvelleRéférenceDossierRaccordement,
    rôle,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    const gestionnaireRéseau = loadGestionnaireRéseau(identifiantGestionnaireRéseau);

    await raccordement.modifierRéférenceDossierRacordement({
      identifiantProjet,
      nouvelleRéférenceDossierRaccordement,
      référenceDossierExpressionRegulière: (
        await gestionnaireRéseau
      ).référenceDossierRaccordementExpressionRegulière,
      référenceDossierRaccordementActuelle,
      rôle,
    });
  };

  mediator.register('Réseau.Raccordement.Command.ModifierRéférenceDossierRaccordement', handler);
};

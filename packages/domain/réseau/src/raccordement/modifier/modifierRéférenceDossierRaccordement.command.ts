import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { Role } from '@potentiel-domain/utilisateur';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
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
    référenceDossierExpressionRegulière,
    rôle,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    const gestionnaireRéseau = loadGestionnaireRéseau(identifiantGestionnaireRéseau);

    await raccordement.modifierRéférenceDossierRacordement({
      identifiantProjet,
      nouvelleRéférenceDossierRaccordement,
      référenceDossierExpressionRegulière,
      référenceDossierRaccordementActuelle,
      rôle,
    });
  };

  mediator.register('MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND', handler);
};

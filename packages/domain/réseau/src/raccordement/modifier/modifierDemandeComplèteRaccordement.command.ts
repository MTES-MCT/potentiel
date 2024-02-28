import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'Réseau.Raccordement.Command.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception: string;
  }
>;

export const registerModifierDemandeComplèteRaccordementCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    dateQualification,
    référenceDossierRaccordement,
    formatAccuséRéception,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau, true);

    await raccordement.modifierDemandeComplèteRaccordement({
      identifiantProjet,
      dateQualification,
      référenceDossierRaccordement,
      formatAccuséRéception,
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
    });
  };

  mediator.register('Réseau.Raccordement.Command.ModifierDemandeComplèteRaccordement', handler);
};

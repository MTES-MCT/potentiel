import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot } from '../../../..';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception: string;
    rôle: Role.ValueType;
  }
>;

export const registerModifierDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async (options) => {
    const projet = await getProjetAggregateRoot(options.identifiantProjet);

    // dans ce cas, on peut le récupérer au niveau de l'aggrégat ?
    const gestionnaireRéseau = await loadGestionnaireRéseau(
      raccordement.identifiantGestionnaireRéseau,
    );

    await projet.lauréat.raccordement.modifierDemandeComplèteRaccordement({
      dateQualification,
      référenceDossierRaccordement,
      formatAccuséRéception,
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement', handler);
};

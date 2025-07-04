import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { LoadAggregate } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
  loadAggregate: LoadAggregate,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    dateQualification,
    référenceDossierRaccordement,
    formatAccuséRéception,
    identifiantProjet,
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    const gestionnaireRéseau = await loadGestionnaireRéseau(
      projet.lauréat.raccordement.identifiantGestionnaireRéseau,
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

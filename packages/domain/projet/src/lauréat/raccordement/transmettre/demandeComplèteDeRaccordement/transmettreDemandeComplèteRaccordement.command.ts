import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception?: string;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
  loadAggregate: LoadAggregate,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    référenceDossier,
    formatAccuséRéception,
    transmisePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    const gestionnaireRéseau = await loadGestionnaireRéseau(
      projet.lauréat.raccordement.identifiantGestionnaireRéseau,
    );

    await projet.lauréat.raccordement.transmettreDemandeComplèteDeRaccordement({
      dateQualification,
      référenceDossier,
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      formatAccuséRéception,
      transmisePar,
      transmiseLe: DateTime.now(),
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};

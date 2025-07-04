import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { GetProjetAggregateRoot, IdentifiantProjet } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

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
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
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

    projet.lauréat.vérifierQueLeLauréatExiste();

    // pareil a priori on a pas besoin de vérifier ici
    const gestionnaireRéseau = await loadGestionnaireRéseau(
      projet.lauréat.raccordement.identifiantGestionnaireRéseau,
    );

    await projet.lauréat.raccordement.transmettreDemandeComplèteDeRaccordement({
      dateQualification,
      identifiantGestionnaireRéseau: raccordement.identifiantGestionnaireRéseau,
      référenceDossier,
      // virer ça, on vérifiera directement dans l'aggregat
      aUnAbandonAccordé: projet.lauréat.abandon.statut.estAccordé(),
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      formatAccuséRéception,
      transmisePar,
      transmiseLe: DateTime.now(),
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};

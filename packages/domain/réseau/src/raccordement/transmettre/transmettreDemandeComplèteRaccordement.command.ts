import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Abandon } from '@potentiel-domain/laureat';
import { loadÉliminéFactory } from '@potentiel-domain/elimine/dist/éliminé.aggregate';

import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception: string;
  }
>;

export const registerTransmettreDemandeComplèteRaccordementCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadAbandon = Abandon.loadAbandonFactory(loadAggregate);
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = loadGestionnaireRéseauFactory(loadAggregate);
  const loadÉliminé = loadÉliminéFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDossier,
    formatAccuséRéception,
  }) => {
    const abandon = await loadAbandon(identifiantProjet, false);
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau, true);
    const raccordement = await loadRaccordement(identifiantProjet, false);
    const éliminé = await loadÉliminé(identifiantProjet, false);

    await raccordement.transmettreDemande({
      dateQualification,
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossier,
      aUnAbandonAccordé: abandon.estAccordé(),
      estÉliminé: !!éliminé,
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      formatAccuséRéception,
    });
  };

  mediator.register('Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};

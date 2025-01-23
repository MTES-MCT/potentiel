import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadAbandonFactory } from '../../abandon';
import { loadLauréatFactory } from '../../lauréat.aggregate';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception: string;
  }
>;

export const registerTransmettreDemandeComplèteRaccordementCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);
  const loadLauréat = loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    référenceDossier,
    formatAccuséRéception,
  }) => {
    await loadLauréat(identifiantProjet);

    const abandon = await loadAbandon(identifiantProjet, false);
    const raccordement = await loadRaccordement(identifiantProjet);
    const gestionnaireRéseau = await loadGestionnaireRéseau(
      raccordement.identifiantGestionnaireRéseau,
    );

    await raccordement.transmettreDemande({
      dateQualification,
      identifiantGestionnaireRéseau: raccordement.identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossier,
      aUnAbandonAccordé: abandon.estAccordé(),
      référenceDossierExpressionRegulière:
        gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière,
      formatAccuséRéception,
    });
  };

  mediator.register('Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};

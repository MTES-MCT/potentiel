import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { GetProjetAggregateRoot, IdentifiantProjet } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadAbandonFactory } from '../../abandon';

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
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
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
      transmisePar,
      transmiseLe: DateTime.now(),
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};

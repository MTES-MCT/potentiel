import { Message, MessageHandler, mediator } from 'mediateur';
import { DemandeComplèteRaccordementTransmiseEvent } from '../../../raccordement/raccordement.event';
import { ProjetCommand } from '../../projet.command';
import {
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
} from '../../../domain.valueType';

export type ExecuterAjouterGestionnaireRéseauProjetSaga = Message<
  'EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
  DemandeComplèteRaccordementTransmiseEvent
>;

export const registerExecuterAjouterGestionnaireRéseauProjetSaga = () => {
  const handler: MessageHandler<ExecuterAjouterGestionnaireRéseauProjetSaga> = async ({
    payload: { identifiantGestionnaireRéseau, identifiantProjet },
  }) => {
    await mediator.send<ProjetCommand>({
      type: 'DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
          identifiantGestionnaireRéseau,
        ),
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
      },
    });
  };

  mediator.register('EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA', handler);
};

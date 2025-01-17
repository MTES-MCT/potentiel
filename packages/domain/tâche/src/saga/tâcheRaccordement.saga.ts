import { Message, MessageHandler, mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import * as Tâche from '../typeTâche.valueType';

export type SubscriptionEvent =
  | Raccordement.RéférenceDossierRacordementModifiéeEvent
  | Raccordement.RéférenceDossierRacordementModifiéeEventV1
  | Raccordement.GestionnaireRéseauRaccordementModifiéEvent
  | Raccordement.GestionnaireRéseauInconnuAttribuéEvent
  | Raccordement.RaccordementSuppriméEvent;

export type Execute = Message<'System.Saga.TâcheRaccordement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'RéférenceDossierRacordementModifiée-V1':
      case 'RéférenceDossierRacordementModifiée-V2':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.raccordementRéférenceNonTransmise,
          },
        });
        break;
      case 'GestionnaireRéseauInconnuAttribué-V1':
        await mediator.send<AjouterTâcheCommand>({
          type: 'System.Tâche.Command.AjouterTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
          },
        });
        break;
      case 'GestionnaireRéseauRaccordementModifié-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
          },
        });
        break;
      case 'RaccordementSupprimé-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.raccordementRéférenceNonTransmise,
          },
        });
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
          },
        });
        break;
    }
  };

  mediator.register('System.Saga.TâcheRaccordement', handler);
};

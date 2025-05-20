import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Raccordement } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import * as Tâche from '../typeTâche.valueType';
import { TypeTâche } from '../tâche';

export type SubscriptionEvent =
  | Raccordement.RéférenceDossierRacordementModifiéeEvent
  | Raccordement.RéférenceDossierRacordementModifiéeEventV1
  | Raccordement.GestionnaireRéseauRaccordementModifiéEvent
  | Raccordement.GestionnaireRéseauInconnuAttribuéEvent
  | Raccordement.RaccordementSuppriméEvent
  | Raccordement.DemandeComplèteRaccordementModifiéeEvent
  | Raccordement.DemandeComplèteRaccordementTransmiseEvent;

export type Execute = Message<'System.Saga.TâcheRaccordement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with(
        {
          type: P.union(
            'RéférenceDossierRacordementModifiée-V1',
            'RéférenceDossierRacordementModifiée-V2',
          ),
        },
        async (event) => {
          await mediator.send<AcheverTâcheCommand>({
            type: 'System.Tâche.Command.AcheverTâche',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                event.payload.identifiantProjet,
              ),
              typeTâche: Tâche.raccordementRéférenceNonTransmise,
            },
          });
        },
      )
      .with(
        {
          type: 'GestionnaireRéseauInconnuAttribué-V1',
        },
        async (event) => {
          await mediator.send<AjouterTâcheCommand>({
            type: 'System.Tâche.Command.AjouterTâche',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                event.payload.identifiantProjet,
              ),
              typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
            },
          });
        },
      )
      .with({ type: 'GestionnaireRéseauRaccordementModifié-V1' }, async (event) => {
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(
              event.payload.identifiantProjet,
            ),
            typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
          },
        });
      })
      .with(
        {
          type: 'RaccordementSupprimé-V1',
        },
        async (event) => {
          await mediator.send<AcheverTâcheCommand>({
            type: 'System.Tâche.Command.AcheverTâche',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                event.payload.identifiantProjet,
              ),
              typeTâche: Tâche.raccordementRéférenceNonTransmise,
            },
          });
          await mediator.send<AcheverTâcheCommand>({
            type: 'System.Tâche.Command.AcheverTâche',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                event.payload.identifiantProjet,
              ),
              typeTâche: Tâche.raccordementGestionnaireRéseauInconnuAttribué,
            },
          });
        },
      )
      .with({ type: 'DemandeComplèteDeRaccordementTransmise-V3' }, async (event) => {
        await mediator.send<AjouterTâcheCommand>({
          type: 'System.Tâche.Command.AjouterTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(
              event.payload.identifiantProjet,
            ),
            typeTâche: TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
          },
        });
      })
      .with(
        {
          type: 'DemandeComplèteRaccordementModifiée-V3',
        },
        async (event) => {
          await mediator.send<AcheverTâcheCommand>({
            type: 'System.Tâche.Command.AcheverTâche',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                event.payload.identifiantProjet,
              ),
              typeTâche: Tâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
            },
          });
        },
      )
      .exhaustive();

  mediator.register('System.Saga.TâcheRaccordement', handler);
};

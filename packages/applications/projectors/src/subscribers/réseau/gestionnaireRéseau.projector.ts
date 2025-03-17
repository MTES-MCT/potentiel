import { Message, MessageHandler, mediator } from 'mediateur';
import { Pattern, match } from 'ts-pattern';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { ExpressionRegulière } from '@potentiel-domain/common';

export type SubscriptionEvent =
  | (GestionnaireRéseau.GestionnaireRéseauEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Réseau.Gestionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
        `gestionnaire-réseau|${payload.id}`,
      );
    } else {
      switch (type) {
        case 'GestionnaireRéseauAjouté-V1':
        case 'GestionnaireRéseauModifié-V1':
          const {
            aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
            codeEIC,
            raisonSociale,
          } = payload;
          await upsertProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
            `gestionnaire-réseau|${payload.codeEIC}`,
            {
              codeEIC,
              raisonSociale,
              contactEmail: '',
              aideSaisieRéférenceDossierRaccordement: {
                format,
                légende,
                expressionReguliere: match(expressionReguliere)
                  .with('', () => ExpressionRegulière.accepteTout)
                  .with(Pattern.nullish, () => ExpressionRegulière.accepteTout)
                  .otherwise((value) => ExpressionRegulière.convertirEnValueType(value))
                  .formatter(),
              },
            },
          );
          break;
        case 'GestionnaireRéseauAjouté-V2':
        case 'GestionnaireRéseauModifié-V2':
          await upsertProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
            `gestionnaire-réseau|${payload.codeEIC}`,
            {
              ...payload,
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Réseau.Gestionnaire', handler);
};

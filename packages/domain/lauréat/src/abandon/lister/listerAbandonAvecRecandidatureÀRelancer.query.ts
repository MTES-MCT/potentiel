import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonAvecRecandidatureSansPreuveProjection } from '../abandon.entity';
import { List } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

type AbandonsAvecRecandidatureÀRelancerReadModel = {
  résultats: Array<{
    identifiantProjet: IdentifiantProjet.ValueType;
    demandéeLe: DateTime.ValueType;
  }>;
};

export type ListerAbandonsAvecRecandidatureÀRelancerQuery = Message<
  'Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer',
  {},
  AbandonsAvecRecandidatureÀRelancerReadModel
>;

export type ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies = {
  list: List;
};

export const registerListerAbandonsAvecRecandidatureÀRelancerQuery = ({
  list,
}: ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies) => {
  const handler: MessageHandler<ListerAbandonsAvecRecandidatureÀRelancerQuery> = async ({}) => {
    const result = await list<AbandonAvecRecandidatureSansPreuveProjection>({
      type: 'abandon-avec-recandidature-sans-preuve',
    });

    return {
      résultats: result.items
        .map((item) => ({
          identifiantProjet: IdentifiantProjet.convertirEnValueType(item.identifiantProjet),
          demandéeLe: DateTime.convertirEnValueType(item.demandéeLe),
        }))
        .filter(({ demandéeLe }) => demandéeLe.nombreJoursÉcartAvec(DateTime.now()) >= 90),
    };
  };

  mediator.register('Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer', handler);
};

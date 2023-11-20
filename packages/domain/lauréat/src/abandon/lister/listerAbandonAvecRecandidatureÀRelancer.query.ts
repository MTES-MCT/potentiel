import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonAvecRecandidatureSansPreuveProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

type AbandonsAvecRecandidatureÀRelancerReadModel = {
  résultats: Array<{
    identifiantProjet: IdentifiantProjet.ValueType;
    demandéeLe: DateTime.ValueType;
  }>;
};

export type ListerAbandonsAvecRecandidatureÀRelancerQuery = Message<
  'LISTER_ABANDONS_AVEC_RECANDIDATURE_À_RELANCER_QUERY',
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

  mediator.register('LISTER_ABANDONS_AVEC_RECANDIDATURE_À_RELANCER_QUERY', handler);
};

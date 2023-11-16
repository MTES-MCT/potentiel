import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonAvecRecandidatureSansPreuveProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';
import { IdentifiantProjet } from '@potentiel-domain/common';

type AbandonsAvecRecandidatureSansPreuveReadModel = {
  identifiantProjets: Array<IdentifiantProjet.ValueType>;
};

export type ListerAbandonsAvecRecandidatureSansPreuveQuery = Message<
  'LISTER_ABANDONS_AVEC_RECANDIDATURE_SANS_PREUVE_QUERY',
  {},
  AbandonsAvecRecandidatureSansPreuveReadModel
>;

export type ListerAbandonDependencies = {
  list: List;
};

export const registerListerAbandonAvecRecandidatureSansPreuveQuery = ({
  list,
}: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsAvecRecandidatureSansPreuveQuery> = async ({}) => {
    const result = await list<AbandonAvecRecandidatureSansPreuveProjection>({
      type: 'abandon-avec-recandidature-sans-preuve',
    });

    return {
      identifiantProjets: result.items.map((item) =>
        IdentifiantProjet.convertirEnValueType(item.identifiantProjet),
      ),
    };
  };

  mediator.register('LISTER_ABANDONS_AVEC_RECANDIDATURE_SANS_PREUVE_QUERY', handler);
};

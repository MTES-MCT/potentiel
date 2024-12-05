import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { Lauréat } from '../..';

export type ConsulterActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: String;
};

export type ConsulterActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterActionnaireReadModel>
>;

export type ConsulterActionnaireDependencies = {
  find: Find;
};

export const registerConsulterActionnaireQuery = ({ find }: ConsulterActionnaireDependencies) => {
  const handler: MessageHandler<ConsulterActionnaireQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const lauréat = await find<Lauréat.LauréatEntity>(
      `lauréat|${identifiantProjetValueType.formatter()}`,
      { select: ['identifiantProjet', 'actionnaire.nom', 'actionnaire.dernièreMiseÀJourLe'] },
    );

    return Option.match(lauréat)
      .some((lauréat) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          actionnaire: lauréat.actionnaire,
        }),
      )
      .none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterActionnaire', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: Lauréat.LauréatEntity['actionnaire'];
}) => Option.Type<ConsulterActionnaireReadModel>;

const mapToReadModel: MapToReadModel = ({ identifiantProjet, actionnaire }) => {
  if (!actionnaire) {
    return Option.none;
  }

  return {
    identifiantProjet,
    actionnaire: actionnaire.nom,
  };
};

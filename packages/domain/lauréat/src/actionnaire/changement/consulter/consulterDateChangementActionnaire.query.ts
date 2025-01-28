import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ActionnaireEntity } from '../..';

export type ConsulterDateChangementActionnaireReadModel = DateTime.ValueType;

export type ConsulterDateChangementActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterDateChangementActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDateChangementActionnaireReadModel>
>;
export type ConsulterChangementActionnaireEnCoursDependencies = {
  find: Find;
};
export const registerConsulterDateChangementActionnaireQuery = ({
  find,
}: ConsulterChangementActionnaireEnCoursDependencies) => {
  const handler: MessageHandler<ConsulterDateChangementActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const actionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.isSome(actionnaire) && actionnaire.dateDemandeEnCours
      ? DateTime.convertirEnValueType(actionnaire.dateDemandeEnCours)
      : Option.none;
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterDateChangementActionnaire', handler);
};

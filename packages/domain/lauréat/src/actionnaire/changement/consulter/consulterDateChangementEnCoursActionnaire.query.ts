import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { ActionnaireEntity } from '../..';

export type ConsulterDateChangementActionnaireEnCoursReadModel = DateTime.ValueType;

export type ConsulterDateChangementEnCoursActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterDateChangementEnCoursActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDateChangementActionnaireEnCoursReadModel>
>;
export type ConsulterChangementActionnaireEnCoursDependencies = {
  find: Find;
};
export const registerConsulterDateChangementEnCoursActionnaireQuery = ({
  find,
}: ConsulterChangementActionnaireEnCoursDependencies) => {
  const handler: MessageHandler<ConsulterDateChangementEnCoursActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const actionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.isSome(actionnaire) && actionnaire.demandeEnCours
      ? DateTime.convertirEnValueType(actionnaire.demandeEnCours.demandéeLe)
      : Option.none;
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterDateChangementEnCoursActionnaire', handler);
};

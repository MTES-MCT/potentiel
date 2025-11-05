import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireEntity } from '..';

export type ConsulterActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  dateDemandeEnCours?: DateTime.ValueType;
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

    const actionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(actionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterActionnaire', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  actionnaire,
  dateDemandeEnCours,
}: ActionnaireEntity) => {
  if (!actionnaire) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    actionnaire: actionnaire.nom,
    dateDemandeEnCours: dateDemandeEnCours
      ? DateTime.convertirEnValueType(dateDemandeEnCours)
      : undefined,
  };
};

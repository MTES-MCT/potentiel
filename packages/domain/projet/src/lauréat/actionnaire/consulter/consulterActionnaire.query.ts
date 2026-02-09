import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { ActionnaireEntity } from '..';
import { IdentifiantProjet } from '../../..';

export type ConsulterActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
} & (
  | {
      aUneDemandeEnCours: true;
      dateDernièreDemande: DateTime.ValueType;
    }
  | {
      aUneDemandeEnCours: false;
      dateDernièreDemande?: DateTime.ValueType;
    }
);

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

export const mapToReadModel = ({ identifiantProjet, actionnaire, demande }: ActionnaireEntity) => {
  if (!actionnaire) {
    return Option.none;
  }

  const aUneDemandeEnCours = !!(demande && demande.statut === 'demandé');

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    actionnaire: actionnaire.nom,
    ...(aUneDemandeEnCours
      ? {
          aUneDemandeEnCours: true as const,
          dateDernièreDemande: DateTime.convertirEnValueType(demande.date),
        }
      : {
          aUneDemandeEnCours: false as const,
          dateDernièreDemande: demande ? DateTime.convertirEnValueType(demande.date) : undefined,
        }),
  };
};

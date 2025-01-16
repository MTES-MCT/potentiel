import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementActionnaireEntity, StatutChangementActionnaire } from '../..';

type ChangementActionnaireItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementActionnaire.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerChangementActionnaireReadModel = {
  items: ReadonlyArray<ChangementActionnaireItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
  {
    utilisateur: {
      rôle: string;
      email: string;
      régionDreal?: string;
    };
    statut?: StatutChangementActionnaire.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementActionnaireReadModel
>;

export type ListerChangementActionnaireDependencies = {
  list: List;
};

export const registerListerChangementActionnaireQuery = ({
  list,
}: ListerChangementActionnaireDependencies) => {
  const handler: MessageHandler<ListerChangementActionnaireQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const options: ListOptions<ChangementActionnaireEntity> = {
      range,
      orderBy: {
        demande: {
          demandéeLe: 'descending',
        },
      },
      where: {
        demande: {
          statut: statut ? Where.equal(statut) : Where.notEqualNull(),
        },
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
        },
      },
    };

    const demandes = await list<ChangementActionnaireEntity>('changement-actionnaire', options);

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Actionnaire.Query.ListerChangementActionnaire', handler);
};

const mapToReadModel = (
  entity: ChangementActionnaireEntity,
): ChangementActionnaireItemReadModel => ({
  nomProjet: entity.projet.nom,
  statut: StatutChangementActionnaire.convertirEnValueType(entity.demande.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
});

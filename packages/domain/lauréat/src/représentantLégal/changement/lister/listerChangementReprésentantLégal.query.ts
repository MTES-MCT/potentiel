import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementReprésentantLégalEntity, StatutChangementReprésentantLégal } from '../..';

type ChangementReprésentantLégalItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementReprésentantLégal.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerChangementReprésentantLégalReadModel = {
  items: ReadonlyArray<ChangementReprésentantLégalItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
  {
    utilisateur: {
      rôle: string;
      email: string;
      régionDreal?: string;
    };
    statut?: StatutChangementReprésentantLégal.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementReprésentantLégalReadModel
>;

export type ListerChangementReprésentantLégalDependencies = {
  list: List;
};

export const registerListerChangementReprésentantLégalQuery = ({
  list,
}: ListerChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ListerChangementReprésentantLégalQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const options: ListOptions<ChangementReprésentantLégalEntity> = {
      range,
      orderBy: {
        demande: {
          demandéLe: 'descending',
        },
      },
      where: {
        statut: Where.equal(statut),
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
        },
      },
    };

    const demandes = await list<ChangementReprésentantLégalEntity>(
      'changement-représentant-légal',
      options,
    );

    return {
      ...demandes,
      items: demandes.items.map((demande) => mapToReadModel(demande)),
    };
  };

  mediator.register('Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal', handler);
};

const mapToReadModel = (
  entity: ChangementReprésentantLégalEntity,
): ChangementReprésentantLégalItemReadModel => ({
  nomProjet: entity.projet.nom,
  statut: StatutChangementReprésentantLégal.convertirEnValueType(entity.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
});

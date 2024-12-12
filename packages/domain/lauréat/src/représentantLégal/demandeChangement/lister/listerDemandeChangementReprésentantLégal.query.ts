import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { DemandeChangementReprésentantLégalEntity } from '../demandeChangementReprésentantLégal.entity';
import { StatutDemandeChangementReprésentantLégal } from '../..';

type DemandeChangementReprésentantLégalItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutDemandeChangementReprésentantLégal.ValueType;
  demandéLe: DateTime.ValueType;
};

export type ListerDemandeChangementReprésentantLégalReadModel = {
  items: ReadonlyArray<DemandeChangementReprésentantLégalItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDemandeChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ListerDemandeChangementReprésentantLégal',
  {
    utilisateur: {
      rôle: string;
      email: string;
      régionDreal?: string;
    };
    statut?: StatutDemandeChangementReprésentantLégal.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerDemandeChangementReprésentantLégalReadModel
>;

export type ListerDemandeChangementReprésentantLégalDependencies = {
  list: List;
};

export const registerListerDemandeChangementReprésentantLégalQuery = ({
  list,
}: ListerDemandeChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ListerDemandeChangementReprésentantLégalQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const options: ListOptions<DemandeChangementReprésentantLégalEntity> = {
      range,
      orderBy: {
        demandéLe: 'descending',
      },
      where: {
        statut: Where.equal(statut),
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
        },
      },
    };

    const demandes = await list<DemandeChangementReprésentantLégalEntity>(
      'demande-changement-représentant-légal',
      options,
    );
    return {
      ...demandes,
      items: demandes.items.map((demande) => mapToReadModel(demande)),
    };
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.Query.ListerDemandeChangementReprésentantLégal',
    handler,
  );
};

const mapToReadModel = (
  entity: DemandeChangementReprésentantLégalEntity,
): DemandeChangementReprésentantLégalItemReadModel => {
  return {
    nomProjet: entity.projet?.nom ?? 'Projet inconnu',
    statut: StatutDemandeChangementReprésentantLégal.convertirEnValueType(entity.statut),
    demandéLe: DateTime.convertirEnValueType(entity.demandéLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  };
};

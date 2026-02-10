import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import {
  ChangementReprésentantLégalEntity,
  StatutChangementReprésentantLégal,
} from '../../index.js';
import { LauréatEntity } from '../../../lauréat.entity.js';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../../index.js';

type ChangementReprésentantLégalItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  demandéLe: string;
  nomProjet: string;
  statut: StatutChangementReprésentantLégal.ValueType;
  miseÀJourLe: DateTime.ValueType;
};

export type ListerChangementReprésentantLégalReadModel = {
  items: ReadonlyArray<ChangementReprésentantLégalItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutChangementReprésentantLégal.RawType>;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerChangementReprésentantLégalReadModel
>;

export type ListerChangementReprésentantLégalDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementReprésentantLégalQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ListerChangementReprésentantLégalQuery> = async ({
    utilisateur,
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const options: ListOptions<ChangementReprésentantLégalEntity, LauréatEntity> = {
      range,
      orderBy: {
        demande: {
          demandéLe: 'descending',
        },
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        demande: {
          statut: Where.matchAny(statut),
        },
      },
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          nomProjet: Where.like(nomProjet),
          localité: {
            région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
          },
        },
      },
    };

    const demandes = await list<ChangementReprésentantLégalEntity, LauréatEntity>(
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
  entity: ChangementReprésentantLégalEntity & Joined<LauréatEntity>,
): ChangementReprésentantLégalItemReadModel => ({
  nomProjet: entity.lauréat.nomProjet,
  statut: StatutChangementReprésentantLégal.convertirEnValueType(entity.demande.statut),
  miseÀJourLe: DateTime.convertirEnValueType(entity.miseÀJourLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: entity.demande.demandéLe,
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { DemandeDélaiEntity, StatutDemandeDélai } from '..';

type DemandeDélaiItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutDemandeDélai.ValueType;
  misÀJourLe: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  nombreDeMois: number;
};

export type ListerDemandeDélaiReadModel = {
  items: ReadonlyArray<DemandeDélaiItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDemandeDélaiQuery = Message<
  'Lauréat.Délai.Query.ListerDemandeDélai',
  {
    utilisateur: Email.RawType;
    statut?: StatutDemandeDélai.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerDemandeDélaiReadModel
>;

export type ListerDemandeDélaiDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerDemandeDélaiQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDemandeDélaiDependencies) => {
  const handler: MessageHandler<ListerDemandeDélaiQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));
    const demandes = await list<DemandeDélaiEntity, LauréatEntity>('demande-délai', {
      range,
      orderBy: {
        demandéLe: 'descending',
      },
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre: Where.equal(appelOffre),
          nomProjet: Where.contain(nomProjet),
          localité: {
            région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
          },
        },
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        statut: Where.equal(statut),
      },
    });

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Délai.Query.ListerDemandeDélai', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  demandéLe,
  statut,
  nombreDeMois,
  lauréat: { nomProjet },
}: DemandeDélaiEntity & Joined<LauréatEntity>): DemandeDélaiItemReadModel => ({
  nomProjet,
  statut: StatutDemandeDélai.convertirEnValueType(statut),
  misÀJourLe: DateTime.convertirEnValueType(demandéLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(demandéLe),
  nombreDeMois,
});

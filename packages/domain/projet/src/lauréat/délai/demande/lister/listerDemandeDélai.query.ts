import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { AutoritéCompétente, StatutDemandeDélai } from '../..';
import { DemandeDélaiEntity } from '../demandeDélai.entity';

type DemandeDélaiItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutDemandeDélai.ValueType;
  miseÀJourLe: DateTime.ValueType;
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
    statuts?: StatutDemandeDélai.RawType[];
    identifiantProjet?: IdentifiantProjet.RawType;
    appelOffre?: string;
    nomProjet?: string;
    autoritéCompétente?: AutoritéCompétente.RawType;
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
    statuts,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
    identifiantProjet,
    autoritéCompétente,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const identifiantProjets =
      scope.type === 'projet'
        ? identifiantProjet
          ? scope.identifiantProjets.filter((id) => id === identifiantProjet)
          : scope.identifiantProjets
        : identifiantProjet
          ? [identifiantProjet]
          : undefined;

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
          nomProjet: Where.like(nomProjet),
          localité: {
            région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
          },
        },
      },
      where: {
        identifiantProjet: Where.matchAny(identifiantProjets),
        statut: Where.matchAny(statuts),
        autoritéCompétente: Where.equal(autoritéCompétente),
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
  miseÀJourLe,
}: DemandeDélaiEntity & Joined<LauréatEntity>): DemandeDélaiItemReadModel => ({
  nomProjet,
  statut: StatutDemandeDélai.convertirEnValueType(statut),
  miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(demandéLe),
  nombreDeMois,
});

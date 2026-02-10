import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementActionnaireEntity, StatutChangementActionnaire } from '../../index.js';
import { LauréatEntity } from '../../../lauréat.entity.js';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../../index.js';

type ChangementActionnaireItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementActionnaire.ValueType;
  miseÀJourLe: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  nouvelActionnaire: string;
};

export type ListerChangementActionnaireReadModel = {
  items: ReadonlyArray<ChangementActionnaireItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutChangementActionnaire.RawType>;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerChangementActionnaireReadModel
>;

export type ListerChangementActionnaireDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementActionnaireQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementActionnaireDependencies) => {
  const handler: MessageHandler<ListerChangementActionnaireQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementActionnaireEntity, LauréatEntity>(
      'changement-actionnaire',
      {
        range,
        orderBy: {
          demande: {
            demandéeLe: 'descending',
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
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          demande: {
            statut: Where.matchAny(statut),
          },
        },
      },
    );

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Actionnaire.Query.ListerChangementActionnaire', handler);
};

const mapToReadModel = (
  entity: ChangementActionnaireEntity & Joined<LauréatEntity>,
): ChangementActionnaireItemReadModel => ({
  nomProjet: entity.lauréat.nomProjet,
  statut: StatutChangementActionnaire.convertirEnValueType(entity.demande.statut),
  miseÀJourLe: DateTime.convertirEnValueType(entity.miseÀJourLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  nouvelActionnaire: entity.demande.nouvelActionnaire,
});

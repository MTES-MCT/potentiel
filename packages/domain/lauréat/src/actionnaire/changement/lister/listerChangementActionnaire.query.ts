import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';

import { ChangementActionnaireEntity, StatutChangementActionnaire } from '../..';
import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_utils/getRoleBasedWhereCondition';
import { Lauréat } from '../../..';

type ChangementActionnaireItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementActionnaire.ValueType;
  misÀJourLe: DateTime.ValueType;
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
    utilisateur: Utilisateur;
    statut?: StatutChangementActionnaire.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementActionnaireReadModel
>;

export type ListerChangementActionnaireDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerChangementActionnaireQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerChangementActionnaireDependencies) => {
  const handler: MessageHandler<ListerChangementActionnaireQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const demandes = await list<ChangementActionnaireEntity, Lauréat.LauréatEntity>(
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
            appelOffre: Where.equal(appelOffre),
            nomProjet: Where.contain(nomProjet),
            localité: {
              région: régionProjet,
            },
          },
        },
        where: {
          identifiantProjet,
          demande: {
            statut: statut ? Where.equal(statut) : Where.notEqualNull(),
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
  entity: ChangementActionnaireEntity & Joined<Lauréat.LauréatEntity>,
): ChangementActionnaireItemReadModel => ({
  nomProjet: entity.lauréat.nomProjet,
  statut: StatutChangementActionnaire.convertirEnValueType(entity.demande.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  nouvelActionnaire: entity.demande.nouvelActionnaire,
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_utils/getRoleBasedWhereCondition';
import { ChangementProducteurEntity } from '../changementProducteur.entity';

type ChangementProducteurItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
  ancienProducteur: string;
  nouveauProducteur: string;
};

export type ListerChangementProducteurReadModel = {
  items: ReadonlyArray<ChangementProducteurItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementProducteurQuery = Message<
  'Lauréat.Producteur.Query.ListerChangementProducteur',
  {
    utilisateur: Utilisateur;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementProducteurReadModel
>;

export type ListerChangementProducteurDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerChangementProducteurQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerChangementProducteurDependencies) => {
  const handler: MessageHandler<ListerChangementProducteurQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const demandes = await list<ChangementProducteurEntity, Lauréat.LauréatEntity>(
      'changement-producteur',
      {
        range,
        orderBy: {
          enregistréLe: 'descending',
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
        },
      },
    );

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Producteur.Query.ListerChangementProducteur', handler);
};

const mapToReadModel = (
  entity: ChangementProducteurEntity & Joined<Lauréat.LauréatEntity>,
): ChangementProducteurItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  nomProjet: entity.lauréat.nomProjet,
  enregistréLe: DateTime.convertirEnValueType(entity.enregistréLe),
  ancienProducteur: entity.ancienProducteur,
  nouveauProducteur: entity.nouvelProducteur,
});

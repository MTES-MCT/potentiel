import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { type Joined, type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import type { GetScopeProjetUtilisateur } from '../../../../getScopeProjetUtilisateur.port.js';
import { IdentifiantProjet, type Lauréat } from '../../../../index.js';
import type { ChangementProducteurEntity } from '../changementProducteur.entity.js';

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
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementProducteurReadModel
>;

export type ListerChangementProducteurDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerChangementProducteurQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementProducteurDependencies) => {
  const handler: MessageHandler<ListerChangementProducteurQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementProducteurEntity, Lauréat.LauréatEntity>(
      'changement-producteur',
      {
        range,
        orderBy: {
          changement: { enregistréLe: 'descending' },
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
            nomProjet: Where.like(nomProjet),
            localité: {
              région: Where.matchAny(scope.régions),
            },
          },
        },
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
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
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
  ancienProducteur: entity.changement.ancien.producteur,
  nouveauProducteur: entity.changement.nouveau.producteur,
});

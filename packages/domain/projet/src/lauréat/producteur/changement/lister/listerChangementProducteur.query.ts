import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementProducteurEntity } from '../changementProducteur.entity';
import { GetProjetUtilisateurScope } from '../../../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet, Lauréat } from '../../../..';

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
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
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
              région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
            },
          },
        },
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
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
  ancienProducteur: entity.changement.ancienProducteur,
  nouveauProducteur: entity.changement.nouveauProducteur,
});

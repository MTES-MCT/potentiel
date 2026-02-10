import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { GetProjetUtilisateurScope } from '../../../../getScopeProjetUtilisateur.port.js';
import { IdentifiantProjet, Lauréat } from '../../../../index.js';
import { ChangementNomProjetEntity } from '../../../index.js';

type ChangementNomProjetItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  enregistréLe: DateTime.ValueType;
  nomProjet: string;
};

export type ListerChangementNomProjetReadModel = {
  items: ReadonlyArray<ChangementNomProjetItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementNomProjetQuery = Message<
  'Lauréat.Query.ListerChangementNomProjet',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementNomProjetReadModel
>;

export type ListerChangementNomProjetDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementNomProjetQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementNomProjetDependencies) => {
  const handler: MessageHandler<ListerChangementNomProjetQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementNomProjetEntity, Lauréat.LauréatEntity>(
      'changement-nom-projet',
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

  mediator.register('Lauréat.Query.ListerChangementNomProjet', handler);
};

const mapToReadModel = (entity: ChangementNomProjetEntity): ChangementNomProjetItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
  nomProjet: entity.changement.nomProjet,
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementInstallateurEntity } from '../changementInstallateur.entity';
import { GetProjetUtilisateurScope } from '../../../../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet, Lauréat } from '../../../../..';

type ChangementInstallateurItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
  installateur: string;
};

export type ListerChangementInstallateurReadModel = {
  items: ReadonlyArray<ChangementInstallateurItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementInstallateurQuery = Message<
  'Lauréat.Installateur.Query.ListerChangementInstallateur',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementInstallateurReadModel
>;

export type ListerChangementInstallateurDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementInstallateurQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementInstallateurDependencies) => {
  const handler: MessageHandler<ListerChangementInstallateurQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementInstallateurEntity, Lauréat.LauréatEntity>(
      'changement-installateur',
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

  mediator.register('Lauréat.Installateur.Query.ListerChangementInstallateur', handler);
};

const mapToReadModel = (
  entity: ChangementInstallateurEntity & Joined<Lauréat.LauréatEntity>,
): ChangementInstallateurItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  nomProjet: entity.lauréat.nomProjet,
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
  installateur: entity.changement.installateur,
});

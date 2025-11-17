import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementDispositifDeStockageEntity } from '../changementDispositifDeStockage.entity';
import { GetProjetUtilisateurScope } from '../../../../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet, Lauréat } from '../../../../..';
import { DispositifDeStockage } from '../../..';

type ChangementDispositifDeStockageItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
  dispositifDeStockage: DispositifDeStockage.ValueType;
};

export type ListerChangementDispositifDeStockageReadModel = {
  items: ReadonlyArray<ChangementDispositifDeStockageItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementDispositifDeStockageQuery = Message<
  'Lauréat.Installation.Query.ListerChangementDispositifDeStockage',
  {
    utilisateur: Email.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementDispositifDeStockageReadModel
>;

export type ListerChangementDispositifDeStockageDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementDispositifDeStockageQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementDispositifDeStockageDependencies) => {
  const handler: MessageHandler<ListerChangementDispositifDeStockageQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementDispositifDeStockageEntity, Lauréat.LauréatEntity>(
      'changement-dispositif-de-stockage',
      {
        range,
        orderBy: {
          changement: { enregistréLe: 'descending' },
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

  mediator.register('Lauréat.Installation.Query.ListerChangementDispositifDeStockage', handler);
};

const mapToReadModel = (
  entity: ChangementDispositifDeStockageEntity & Joined<Lauréat.LauréatEntity>,
): ChangementDispositifDeStockageItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  nomProjet: entity.lauréat.nomProjet,
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
  dispositifDeStockage: DispositifDeStockage.convertirEnValueType(
    entity.changement.dispositifDeStockage,
  ),
});

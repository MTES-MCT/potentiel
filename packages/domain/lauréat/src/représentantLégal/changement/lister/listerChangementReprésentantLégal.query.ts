import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';

import { ChangementReprésentantLégalEntity, StatutChangementReprésentantLégal } from '../..';
import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_utils/getRoleBasedWhereCondition';

type ChangementReprésentantLégalItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  demandéLe: string;
  nomProjet: string;
  statut: StatutChangementReprésentantLégal.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerChangementReprésentantLégalReadModel = {
  items: ReadonlyArray<ChangementReprésentantLégalItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementReprésentantLégalQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
  {
    utilisateur: Utilisateur;
    statut?: StatutChangementReprésentantLégal.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerChangementReprésentantLégalReadModel
>;

export type ListerChangementReprésentantLégalDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerChangementReprésentantLégalQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ListerChangementReprésentantLégalQuery> = async ({
    utilisateur,
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const options: ListOptions<ChangementReprésentantLégalEntity> = {
      range,
      orderBy: {
        demande: {
          demandéLe: 'descending',
        },
      },
      where: {
        identifiantProjet,
        demande: {
          statut: Where.equal(statut),
        },
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
          région: régionProjet,
        },
      },
    };

    const demandes = await list<ChangementReprésentantLégalEntity>(
      'changement-représentant-légal',
      options,
    );

    return {
      ...demandes,
      items: demandes.items.map((demande) => mapToReadModel(demande)),
    };
  };

  mediator.register('Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal', handler);
};

const mapToReadModel = (
  entity: ChangementReprésentantLégalEntity,
): ChangementReprésentantLégalItemReadModel => ({
  nomProjet: entity.projet.nom,
  statut: StatutChangementReprésentantLégal.convertirEnValueType(entity.demande.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: entity.demande.demandéLe,
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_utils/getRoleBasedWhereCondition';
import { Lauréat } from '../../..';
import {
  ChangementPuissanceEntity,
  RatioChangementPuissance,
  StatutChangementPuissance,
} from '../..';

type ChangementPuissanceItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementPuissance.ValueType;
  misÀJourLe: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  nouvellePuissance: number;
};

export type ListerChangementPuissanceReadModel = {
  items: ReadonlyArray<ChangementPuissanceItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementPuissanceQuery = Message<
  'Lauréat.Puissance.Query.ListerChangementPuissance',
  {
    utilisateur: Utilisateur;
    statut?: StatutChangementPuissance.RawType;
    appelOffre?: string;
    nomProjet?: string;
    autoriteInstructrice?: RatioChangementPuissance.AutoritéCompétente;
    range: RangeOptions;
  },
  ListerChangementPuissanceReadModel
>;

export type ListerChangementPuissanceDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerChangementPuissanceQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerChangementPuissanceDependencies) => {
  const handler: MessageHandler<ListerChangementPuissanceQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    autoriteInstructrice,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const demandes = await list<ChangementPuissanceEntity, Lauréat.LauréatEntity>(
      'changement-puissance',
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
            statut: statut
              ? Where.equal(statut as ChangementPuissanceEntity['demande']['statut'])
              : Where.notEqualNull(),
            autoritéCompétente: autoriteInstructrice
              ? Where.equal(autoriteInstructrice)
              : Where.notEqualNull(),
          },
        },
      },
    );

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Puissance.Query.ListerChangementPuissance', handler);
};

const mapToReadModel = (
  entity: ChangementPuissanceEntity & Joined<Lauréat.LauréatEntity>,
): ChangementPuissanceItemReadModel => ({
  nomProjet: entity.lauréat.nomProjet,
  statut: StatutChangementPuissance.convertirEnValueType(entity.demande.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  nouvellePuissance: entity.demande.nouvellePuissance,
});

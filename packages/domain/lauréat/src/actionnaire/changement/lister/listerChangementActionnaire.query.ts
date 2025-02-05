import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

import { ChangementActionnaireEntity, StatutChangementActionnaire } from '../..';
import { getRoleBasedWhereCondition, Utilisateur } from '../../../utils/getRoleBasedWhereCondition';

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
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
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

    const options: ListOptions<ChangementActionnaireEntity> = {
      range,
      orderBy: {
        demande: {
          demandéeLe: 'descending',
        },
      },
      where: {
        identifiantProjet,
        demande: {
          statut: statut ? Where.equal(statut) : Where.notEqualNull(),
        },
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
          région: régionProjet,
        },
      },
    };

    const demandes = await list<ChangementActionnaireEntity>('changement-actionnaire', options);

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Actionnaire.Query.ListerChangementActionnaire', handler);
};

const mapToReadModel = (
  entity: ChangementActionnaireEntity,
): ChangementActionnaireItemReadModel => ({
  nomProjet: entity.projet.nom,
  statut: StatutChangementActionnaire.convertirEnValueType(entity.demande.statut),
  misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
  nouvelActionnaire: entity.demande.nouvelActionnaire,
});

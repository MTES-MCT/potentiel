import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';
import { Role, RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

import { ChangementReprésentantLégalEntity, StatutChangementReprésentantLégal } from '../..';

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
    utilisateur: {
      rôle: string;
      email: string;
      régionDreal?: string;
    };
    statut?: StatutChangementReprésentantLégal.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementReprésentantLégalReadModel
>;

export type ListerChangementReprésentantLégalDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerChangementReprésentantLégalQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerChangementReprésentantLégalDependencies) => {
  const handler: MessageHandler<ListerChangementReprésentantLégalQuery> = async ({
    utilisateur: { rôle, email, régionDreal },
    statut,
    appelOffre,
    nomProjet,
    range,
  }) => {
    const régionProjet = Role.convertirEnValueType(rôle).estÉgaleÀ(Role.dreal)
      ? (régionDreal ?? 'non-trouvée')
      : undefined;

    const options: ListOptions<ChangementReprésentantLégalEntity> = {
      range,
      orderBy: {
        demande: {
          demandéLe: 'descending',
        },
      },
      where: {
        identifiantProjet: await getIdentifiantProjetWhereCondition(
          rôle,
          email,
          récupérerIdentifiantsProjetParEmailPorteur,
        ),
        demande: {
          statut: Where.equal(statut),
        },
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
          région: Where.equal(régionProjet),
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

const getIdentifiantProjetWhereCondition = async (
  rôle: string,
  email: string,
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur,
) => {
  if (Role.convertirEnValueType(rôle).estÉgaleÀ(Role.porteur)) {
    const identifiantProjets = await récupérerIdentifiantsProjetParEmailPorteur(email);

    return Where.include(identifiantProjets);
  }

  return undefined;
};

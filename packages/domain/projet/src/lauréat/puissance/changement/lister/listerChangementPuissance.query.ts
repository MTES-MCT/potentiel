import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementPuissanceEntity, StatutChangementPuissance } from '../..';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { LauréatEntity } from '../../../lauréat.entity';
import { CandidatureEntity } from '../../../../candidature';

type ChangementPuissanceItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutChangementPuissance.ValueType;
  misÀJourLe: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  nouvellePuissance: number;
  unitéPuissance: string;
};

export type ListerChangementPuissanceReadModel = {
  items: ReadonlyArray<ChangementPuissanceItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementPuissanceQuery = Message<
  'Lauréat.Puissance.Query.ListerChangementPuissance',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutChangementPuissance.RawType>;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementPuissanceReadModel
>;

export type ListerChangementPuissanceDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementPuissanceQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementPuissanceDependencies) => {
  const handler: MessageHandler<ListerChangementPuissanceQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));
    const demandes = await list<ChangementPuissanceEntity, [LauréatEntity, CandidatureEntity]>(
      'changement-puissance',
      {
        range,
        orderBy: {
          demande: {
            demandéeLe: 'descending',
          },
        },
        join: [
          {
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
          {
            entity: 'candidature',
            on: 'identifiantProjet',
          },
        ],
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          demande: {
            statut: Where.matchAny(statut),
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

const mapToReadModel = ({
  candidature,
  lauréat,
  ...entity
}: ChangementPuissanceEntity &
  Joined<[LauréatEntity, CandidatureEntity]>): ChangementPuissanceItemReadModel => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(entity.identifiantProjet);

  return {
    nomProjet: lauréat.nomProjet,
    statut: StatutChangementPuissance.convertirEnValueType(entity.demande.statut),
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet,
    demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
    nouvellePuissance: entity.demande.nouvellePuissance,
    unitéPuissance: candidature.unitéPuissance,
  };
};

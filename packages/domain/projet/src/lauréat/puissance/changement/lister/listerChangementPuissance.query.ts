import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AutoritéCompétente, ChangementPuissanceEntity, StatutChangementPuissance } from '../..';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import { LauréatEntity } from '../../../lauréat.entity';
import { CandidatureEntity, UnitéPuissance } from '../../../../candidature';

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
    autoriteInstructrice?: AutoritéCompétente.RawType;
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
    autoriteInstructrice,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));
    const demandes = await list<
      ChangementPuissanceEntity,
      [LauréatEntity, CandidatureEntity, AppelOffre.AppelOffreEntity]
    >('changement-puissance', {
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
            nomProjet: Where.contain(nomProjet),
            localité: {
              région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
            },
          },
        },
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'appel-offre',
          on: 'appelOffres',
        },
      ],
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        demande: {
          statut: Where.matchAny(statut),
          autoritéCompétente: Where.equal(autoriteInstructrice),
        },
      },
    });
    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Puissance.Query.ListerChangementPuissance', handler);
};

const mapToReadModel = ({
  'appel-offre': appelOffres,
  candidature,
  lauréat,
  ...entity
}: ChangementPuissanceEntity &
  Joined<
    [LauréatEntity, CandidatureEntity, AppelOffre.AppelOffreEntity]
  >): ChangementPuissanceItemReadModel => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(entity.identifiantProjet);

  return {
    nomProjet: lauréat.nomProjet,
    statut: StatutChangementPuissance.convertirEnValueType(entity.demande.statut),
    misÀJourLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
    identifiantProjet,
    demandéLe: DateTime.convertirEnValueType(entity.demande.demandéeLe),
    nouvellePuissance: entity.demande.nouvellePuissance,
    unitéPuissance: UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: candidature.technologie,
    }).formatter(),
  };
};

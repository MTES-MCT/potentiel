import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { type List, Where } from '@potentiel-domain/entity';

import type { GetScopeProjetUtilisateur } from './getScopeProjetUtilisateur.port.js';
import type { Lauréat } from './index.js';
import type { AutoritéCompétente } from './lauréat/abandon/index.js';
import type { LauréatEntity } from './lauréat/lauréat.entity.js';

type DemandesEnInstructionListItemReadModel = Partial<
  Record<
    AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
    Array<{ date: DateTime.ValueType }>
  >
>;

export type ListerDemandesEnInstructionReadModel = {
  items: ReadonlyArray<DemandesEnInstructionListItemReadModel>;
  // range: RangeOptions;
  total: number;
};

export type ListerDemandesEnInstructionQuery = Message<
  'Projet.Query.ListerDemandesEnInstruction',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    autoritéCompétente?: AutoritéCompétente.RawType;
    // range?: RangeOptions;
  },
  ListerDemandesEnInstructionReadModel
>;

export type ListerDemandesEnInstructionDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerDemandesEnInstructionQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDemandesEnInstructionDependencies) => {
  const handler: MessageHandler<ListerDemandesEnInstructionQuery> = async ({
    autoritéCompétente,
    utilisateur,
    // range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandesAbandon = await list<Lauréat.Abandon.DemandeAbandonEntity, LauréatEntity>(
      'demande-abandon',
      {
        // range,
        orderBy: {
          miseÀJourLe: 'descending',
        },
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
          statut: Where.matchAny(['demandé', 'en-instruction', 'confirmé']),
          demande: {
            autoritéCompétente: Where.equal(autoritéCompétente),
          },
        },
        select: ['demande.demandéLe'],
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            localité: { région: Where.matchAny(scope.régions) },
          },
        },
      },
    );

    const demandesPuissance = await list<
      Lauréat.Puissance.ChangementPuissanceEntity,
      LauréatEntity
    >('changement-puissance', {
      // range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        demande: {
          statut: Where.matchAny(['demandé']),
        },
      },
      select: ['demande.demandéeLe'],
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          localité: { région: Where.matchAny(scope.régions) },
        },
      },
    });

    const demandesActionnaire = await list<
      Lauréat.Actionnaire.ChangementActionnaireEntity,
      LauréatEntity
    >('changement-actionnaire', {
      // range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        demande: {
          statut: Where.matchAny(['demandé']),
        },
      },
      select: ['demande.demandéeLe'],
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          localité: { région: Where.matchAny(scope.régions) },
        },
      },
    });

    const demandesReprésentantLégal = await list<
      Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity,
      LauréatEntity
    >('changement-représentant-légal', {
      // range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        demande: {
          statut: Where.matchAny(['demandé']),
        },
      },
      select: ['demande.demandéLe'],
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          localité: { région: Where.matchAny(scope.régions) },
        },
      },
    });

    const demandesDélai = await list<Lauréat.Délai.DemandeDélaiEntity, LauréatEntity>(
      'demande-délai',
      {
        // range,
        orderBy: {
          miseÀJourLe: 'descending',
        },
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
          statut: Where.matchAny(['demandé', 'en-instruction']),
          autoritéCompétente: Where.equal(autoritéCompétente),
        },
        select: ['demandéLe'],
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            localité: { région: Where.matchAny(scope.régions) },
          },
        },
      },
    );

    const items: Array<{
      domaine: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
      demandes: Array<{ date: DateTime.ValueType }>;
    }> = [
      {
        domaine: 'abandon',
        demandes: demandesAbandon.items.map((item) => ({
          date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
        })),
      },
      {
        domaine: 'actionnaire',
        demandes: demandesActionnaire.items.map((item) => ({
          date: DateTime.convertirEnValueType(item['demande']['demandéeLe']),
        })),
      },
      {
        domaine: 'délai',
        demandes: demandesDélai.items.map((item) => ({
          date: DateTime.convertirEnValueType(item['demandéLe']),
        })),
      },
      {
        domaine: 'puissance',
        demandes: demandesPuissance.items.map((item) => ({
          date: DateTime.convertirEnValueType(item['demande']['demandéeLe']),
        })),
      },
      {
        domaine: 'représentantLégal',
        demandes: demandesReprésentantLégal.items.map((item) => ({
          date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
        })),
      },
    ];

    return {
      total:
        demandesAbandon.total +
        demandesActionnaire.total +
        demandesDélai.total +
        demandesPuissance.total +
        demandesReprésentantLégal.total,
      items: mapToReadModel(items),
    };
  };

  mediator.register('Projet.Query.ListerDemandesEnInstruction', handler);
};

const mapToReadModel = (
  items: Array<{
    domaine: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
    demandes: Array<{ date: DateTime.ValueType }>;
  }>,
): ReadonlyArray<DemandesEnInstructionListItemReadModel> =>
  items.map(({ domaine, demandes }) => ({
    [domaine]: demandes.map(({ date }) => ({ date })),
  }));

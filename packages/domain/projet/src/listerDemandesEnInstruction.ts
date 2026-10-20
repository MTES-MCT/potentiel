import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import type { GetScopeProjetUtilisateur } from './getScopeProjetUtilisateur.port.js';
import type { Candidature, GetNombreDemandesProjet, Lauréat, Éliminé } from './index.js';
import type { AutoritéCompétente } from './lauréat/abandon/index.js';
import { statut } from './lauréat/garanties-financières/statutGarantiesFinancières.valueType.js';
import type { LauréatEntity } from './lauréat/lauréat.entity.js';

type DemandesEnInstructionListItemReadModel = Record<
  AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
  Array<{ date: DateTime.ValueType }>
>;

export type ListerDemandesEnInstructionReadModel = {
  items: DemandesEnInstructionListItemReadModel;
  total: number;
  range?: RangeOptions;
};

export type ListerDemandesEnInstructionQuery = Message<
  'Projet.Query.ListerDemandesEnInstruction',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    autoritéCompétente?: AutoritéCompétente.RawType;
    range?: RangeOptions;
  },
  ListerDemandesEnInstructionReadModel
>;

export type ListerDemandesEnInstructionDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  getNombreDemandesProjet: GetNombreDemandesProjet;
};

export const registerListerDemandesEnInstructionQuery = ({
  list,
  getScopeProjetUtilisateur,
  getNombreDemandesProjet,
}: ListerDemandesEnInstructionDependencies) => {
  const handler: MessageHandler<ListerDemandesEnInstructionQuery> = async ({
    autoritéCompétente,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const t0 = performance.now();
    const test = await getNombreDemandesProjet({ utilisateur, rôle });
    const t1 = performance.now();
    const t2 = performance.now();

    console.log(`test: ${t1 - t0} ms`);
    console.log(`CompterDemandesEnInstruction: ${t2 - t1} ms`);

    console.log(test);

    const demandesAbandon = await list<Lauréat.Abandon.DemandeAbandonEntity, LauréatEntity>(
      'demande-abandon',
      {
        range,
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
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        statut: Where.matchAny(['demandé']),
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
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        statut: Where.matchAny(['demandé']),
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
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        statut: Where.matchAny(['demandé']),
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
        range,
        orderBy: {
          miseÀJourLe: 'descending',
        },
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
          statut: Where.matchAny(['demandé', 'en-instruction']),
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

    const demandesRecours = await list<
      Éliminé.Recours.DemandeRecoursEntity,
      Candidature.CandidatureEntity
    >('demande-recours', {
      range,
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        statut: Where.matchAny(statut),
      },
      select: ['demande.demandéLe'],
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
        where: {
          localité: {
            région: Where.matchAny(scope.régions),
          },
        },
      },
    });

    const items: DemandesEnInstructionListItemReadModel = {
      abandon: demandesAbandon.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
      })),
      actionnaire: demandesActionnaire.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéeLe']),
      })),
      délai: demandesDélai.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
      })),
      puissance: demandesPuissance.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéeLe']),
      })),
      représentantLégal: demandesReprésentantLégal.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
      })),
      recours: demandesRecours.items.map((item) => ({
        date: DateTime.convertirEnValueType(item['demande']['demandéLe']),
      })),
    };

    return {
      total:
        demandesAbandon.total +
        demandesActionnaire.total +
        demandesDélai.total +
        demandesPuissance.total +
        demandesReprésentantLégal.total,
      items,
      range,
    };
  };

  mediator.register('Projet.Query.ListerDemandesEnInstruction', handler);
};

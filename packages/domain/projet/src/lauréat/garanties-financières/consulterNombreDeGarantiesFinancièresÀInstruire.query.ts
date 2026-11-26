import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type DateTime, Email } from '@potentiel-domain/common';
import { type Count, Where } from '@potentiel-domain/entity';
import type { Région, UserFiltersType } from '@potentiel-domain/utilisateur';

import type { CandidatureEntity } from '../../candidature/candidature.entity.js';
import type { GetScopeProjetUtilisateur } from '../../index.js';
import { StatutLauréat } from '../index.js';
import type { LauréatEntity } from '../lauréat.entity.js';
import type { GarantiesFinancièresEntity } from './garantiesFinancières.entity.js';
import type { MainlevéeGarantiesFinancièresEntity } from './mainlevée/mainlevéeGarantiesFinancières.entity.js';
import * as StatutMainlevéeGarantiesFinancières from './mainlevée/statutMainlevéeGarantiesFinancières.valueType.js';
import * as StatutGarantiesFinancières from './statutGarantiesFinancières.valueType.js';

type Volumétrie = {
  total: number;
  new: number;
};

export type ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel = {
  projetEnAttente: Volumétrie;
  dépôt: Volumétrie;
  demandeMainlevée: Volumétrie;
};

export type ConsulterNombreDeGarantiesFinancièresÀInstruireQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
  {
    utilisateur: string;
    date: DateTime.RawType;
    userFilters?: UserFiltersType;
  },
  ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel
>;

export type ConsulterNombreDeGarantiesFinancièresÀInstruireDependencies = {
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  count: Count;
};

type JoinLauréatProps = {
  régions: ReadonlyArray<Région.RawType>;
  statut?: StatutLauréat.RawType;
  cycle?: UserFiltersType['cycle'];
};

const joinLauréat = ({ régions, statut, cycle }: JoinLauréatProps) => ({
  entity: 'lauréat' as const,
  on: 'identifiantProjet' as const,
  where: {
    localité: { région: Where.matchAny(régions) },
    statut: Where.equal(statut),
    appelOffre: Where.like(`ANY(${cycle})`),
  },
});

type JoinCandidatureProps = {
  technologie?: UserFiltersType['technologie'];
};

const joinCandidature = ({ technologie }: JoinCandidatureProps) => ({
  entity: 'candidature' as const,
  on: 'identifiantProjet' as const,
  where: {
    technologieCalculée: Where.matchAny(technologie),
  },
});

type JoinedEntities = [LauréatEntity, CandidatureEntity];

export const registerConsulterNombreDeGarantiesFinancièresÀInstruireQuery = ({
  getScopeProjetUtilisateur,
  count,
}: ConsulterNombreDeGarantiesFinancièresÀInstruireDependencies) => {
  const handler: MessageHandler<ConsulterNombreDeGarantiesFinancièresÀInstruireQuery> = async ({
    utilisateur,
    date,
    userFilters,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    if (!scope.régions?.length) {
      return {
        dépôt: {
          total: 0,
          new: 0,
        },
        projetEnAttente: {
          total: 0,
          new: 0,
        },
        demandeMainlevée: {
          total: 0,
          new: 0,
        },
      };
    }

    const régions = scope.régions;

    const [
      projetEnAttenteTotal,
      dépôtsTotal,
      dépôtsNew,
      demandeMainlevéeTotal,
      demandeMainlevéeNew,
    ] = await Promise.all([
      count<GarantiesFinancièresEntity, JoinedEntities>('garanties-financieres', {
        where: {
          statut: Where.matchAny([
            StatutGarantiesFinancières.nonDéposé.statut,
            StatutGarantiesFinancières.échu.statut,
          ]),
          enAttente: { motif: Where.notEqualNull() },
          dépôt: { soumisLe: Where.equalNull() },
        },
        join: [
          joinLauréat({ régions, statut: StatutLauréat.actif.statut, cycle: userFilters?.cycle }),
          joinCandidature({ technologie: userFilters?.technologie }),
        ],
      }),
      count<GarantiesFinancièresEntity, JoinedEntities>('garanties-financieres', {
        where: { dépôt: { soumisLe: Where.notEqualNull() } },
        join: [
          joinLauréat({ régions }),
          joinCandidature({ technologie: userFilters?.technologie }),
        ],
      }),
      count<GarantiesFinancièresEntity, JoinedEntities>('garanties-financieres', {
        where: { dépôt: { soumisLe: Where.greaterOrEqual(date) } },
        join: [
          joinLauréat({ régions, cycle: userFilters?.cycle }),
          joinCandidature({ technologie: userFilters?.technologie }),
        ],
      }),
      count<MainlevéeGarantiesFinancièresEntity, JoinedEntities>(
        'mainlevee-garanties-financieres',
        {
          where: {
            statut: Where.matchAny(StatutMainlevéeGarantiesFinancières.statutsEnCours),
          },
          join: [
            joinLauréat({ régions, cycle: userFilters?.cycle }),
            joinCandidature({ technologie: userFilters?.technologie }),
          ],
        },
      ),
      count<MainlevéeGarantiesFinancièresEntity, JoinedEntities>(
        'mainlevee-garanties-financieres',
        {
          where: {
            statut: Where.matchAny(StatutMainlevéeGarantiesFinancières.statutsEnCours),
            demande: { demandéeLe: Where.greaterOrEqual(date) },
          },
          join: [
            joinLauréat({ régions, cycle: userFilters?.cycle }),
            joinCandidature({ technologie: userFilters?.technologie }),
          ],
        },
      ),
    ]);

    return {
      projetEnAttente: { total: projetEnAttenteTotal, new: 0 },
      dépôt: { total: dépôtsTotal, new: dépôtsNew },
      demandeMainlevée: { total: demandeMainlevéeTotal, new: demandeMainlevéeNew },
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
    handler,
  );
};

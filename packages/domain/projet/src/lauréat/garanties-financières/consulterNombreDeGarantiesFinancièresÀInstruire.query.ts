import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type DateTime, Email } from '@potentiel-domain/common';
import { type Count, Where } from '@potentiel-domain/entity';
import type { Région } from '@potentiel-domain/utilisateur';

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
};

const joinLauréat = ({ régions, statut }: JoinLauréatProps) => ({
  entity: 'lauréat' as const,
  on: 'identifiantProjet' as const,
  where: {
    localité: { région: Where.matchAny(régions) },
    statut: Where.equal(statut),
  },
});

export const registerConsulterNombreDeGarantiesFinancièresÀInstruireQuery = ({
  getScopeProjetUtilisateur,
  count,
}: ConsulterNombreDeGarantiesFinancièresÀInstruireDependencies) => {
  const handler: MessageHandler<ConsulterNombreDeGarantiesFinancièresÀInstruireQuery> = async ({
    utilisateur,
    date,
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
      count<GarantiesFinancièresEntity, LauréatEntity>('garanties-financieres', {
        where: {
          statut: Where.matchAny([
            StatutGarantiesFinancières.nonDéposé.statut,
            StatutGarantiesFinancières.échu.statut,
          ]),
          enAttente: { motif: Where.notEqualNull() },
          dépôt: { soumisLe: Where.equalNull() },
        },
        join: joinLauréat({ régions, statut: StatutLauréat.actif.statut }),
      }),
      count<GarantiesFinancièresEntity, LauréatEntity>('garanties-financieres', {
        where: { dépôt: { soumisLe: Where.notEqualNull() } },
        join: joinLauréat({ régions }),
      }),
      count<GarantiesFinancièresEntity, LauréatEntity>('garanties-financieres', {
        where: { dépôt: { soumisLe: Where.greaterOrEqual(date) } },
        join: joinLauréat({ régions }),
      }),
      count<MainlevéeGarantiesFinancièresEntity, LauréatEntity>('mainlevee-garanties-financieres', {
        where: {
          statut: Where.matchAny(StatutMainlevéeGarantiesFinancières.statutsEnCours),
        },
        join: joinLauréat({ régions }),
      }),
      count<MainlevéeGarantiesFinancièresEntity, LauréatEntity>('mainlevee-garanties-financieres', {
        where: {
          statut: Where.matchAny(StatutMainlevéeGarantiesFinancières.statutsEnCours),
          demande: { demandéeLe: Where.greaterOrEqual(date) },
        },
        join: joinLauréat({ régions }),
      }),
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

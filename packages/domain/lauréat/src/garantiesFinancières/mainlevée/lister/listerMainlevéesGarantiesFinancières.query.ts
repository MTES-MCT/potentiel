import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, RangeOptions } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';

import {
  DétailsMainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
} from '../..';
import { getRoleBasedWhereCondition, Utilisateur } from '../../utils/getRoleBasedWhereCondition';

export type ListerMainlevéeItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  appelOffre: string;
  nomProjet: string;
  demande: { demandéeLe: DateTime.ValueType; demandéePar: Email.ValueType };
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: Email.ValueType;
  };
};

export type ListerMainlevéesReadModel = Readonly<{
  items: ReadonlyArray<ListerMainlevéeItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerMainlevéesQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    utilisateur: Utilisateur;
  },
  ListerMainlevéesReadModel
>;

type ListerMainlevéesQueryDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerMainlevéesQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerMainlevéesQueryDependencies) => {
  const handler: MessageHandler<ListerMainlevéesQuery> = async ({
    range,
    appelOffre,
    motif,
    statut,
    utilisateur,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DétailsMainlevéeGarantiesFinancièresEntity>(
      'details-mainlevee-garanties-financieres',
      {
        range,
        where: {
          motif: Where.equal(motif),
          statut: Where.equal(statut),
          appelOffre: Where.equal(appelOffre),
          ...(await getRoleBasedWhereCondition(
            utilisateur,
            récupérerIdentifiantsProjetParEmailPorteur,
          )),
        },
      },
    );

    return {
      items: items.map(listerMainlevéeGarantiesFinancièresMapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Lister', handler);
};

const listerMainlevéeGarantiesFinancièresMapToReadModel = (
  détailsMainlevée: DétailsMainlevéeGarantiesFinancièresEntity,
): ListerMainlevéeItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(détailsMainlevée.identifiantProjet),
  appelOffre: détailsMainlevée.appelOffre,
  nomProjet: détailsMainlevée.nomProjet,
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(détailsMainlevée.statut),
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(détailsMainlevée.motif),
  demande: {
    demandéeLe: DateTime.convertirEnValueType(détailsMainlevée.demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(détailsMainlevée.demande.demandéePar),
  },
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(détailsMainlevée.dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(détailsMainlevée.dernièreMiseÀJour.par),
  },
});

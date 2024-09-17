import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';
import { Where, List, RangeOptions } from '@potentiel-domain/entity';

import {
  MotifDemandeGarantiesFinancières,
  ProjetAvecGarantiesFinancièresEnAttenteEntity,
} from '../..';
import { getRoleBasedWhereCondition, Utilisateur } from '../../getRoleBasedWhereCondition';

type ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
  };
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel = {
  items: ReadonlyArray<ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
  {
    appelOffre?: string;
    motif?: string;
    cycle?: string;
    utilisateur: Utilisateur;
    range?: RangeOptions;
  },
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel
>;

export type ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ListerProjetsAvecGarantiesFinancièresEnAttenteQuery> = async ({
    appelOffre,
    motif,
    utilisateur,
    range,
    cycle,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<ProjetAvecGarantiesFinancièresEnAttenteEntity>(
      'projet-avec-garanties-financieres-en-attente',
      {
        orderBy: { dernièreMiseÀJour: { date: 'descending' } },
        range,
        where: {
          appelOffre: cycle
            ? cycle === 'PPE2'
              ? Where.contains('PPE2')
              : Where.notContains('PPE2')
            : Where.equal(appelOffre),
          motif: Where.equal(motif),
          ...(await getRoleBasedWhereCondition(
            utilisateur,
            récupérerIdentifiantsProjetParEmailPorteur,
          )),
        },
      },
    );

    return {
      items: items.map((item) => mapToReadModel(item)),
      range: { endPosition, startPosition },
      total,
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
    handler,
  );
};

const mapToReadModel = ({
  nomProjet,
  identifiantProjet,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
}: ProjetAvecGarantiesFinancièresEnAttenteEntity): ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});

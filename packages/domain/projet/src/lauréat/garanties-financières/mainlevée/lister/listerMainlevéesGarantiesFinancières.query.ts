import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, RangeOptions, Joined } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../../..';
import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseMainlevée,
} from '../..';
import { LauréatEntity } from '../../..';

export type ListerMainlevéeItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  appelOffre: string;
  nomProjet: string;
  demande: { demandéeLe: DateTime.ValueType; demandéePar: Email.ValueType };
  instruction?: {
    démarréeLe: DateTime.ValueType;
    démarréePar: Email.ValueType;
  };
  accord?: {
    accordéeLe: DateTime.ValueType;
    accordéePar: Email.ValueType;
    courrierAccord: DocumentProjet.ValueType;
  };
  rejet?: {
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    courrierRejet: DocumentProjet.ValueType;
  };
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
  'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
  {
    identifiantProjet?: IdentifiantProjet.RawType;
    range?: RangeOptions;
    appelOffre?: string;
    motif?: MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    identifiantUtilisateur: string;
  },
  ListerMainlevéesReadModel
>;

export type ListerMainlevéesQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerMainlevéesQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerMainlevéesQueryDependencies) => {
  const handler: MessageHandler<ListerMainlevéesQuery> = async ({
    range,
    appelOffre,
    motif,
    statut,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const scope = identifiantProjet
      ? { type: 'projet' as const, identifiantProjets: [identifiantProjet] }
      : await getScopeProjetUtilisateur(Email.convertirEnValueType(identifiantUtilisateur));
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<MainlevéeGarantiesFinancièresEntity, LauréatEntity>(
      'mainlevee-garanties-financieres',
      {
        range,
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          motif: Where.equal(motif),
          statut: Where.equal(statut),
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: Where.equal(appelOffre),
            localité: { région: scope.type === 'region' ? Where.equal(scope.region) : undefined },
          },
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
  mediator.register('Lauréat.GarantiesFinancières.Query.ListerMainlevées', handler);
};

const listerMainlevéeGarantiesFinancièresMapToReadModel = (
  mainlevée: MainlevéeGarantiesFinancièresEntity & Joined<LauréatEntity>,
): ListerMainlevéeItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(mainlevée.identifiantProjet),
  appelOffre: mainlevée.lauréat.appelOffre,
  nomProjet: mainlevée.lauréat.nomProjet,
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut),
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.motif),
  demande: {
    demandéeLe: DateTime.convertirEnValueType(mainlevée.demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(mainlevée.demande.demandéePar),
  },
  instruction: mainlevée.instruction
    ? {
        démarréeLe: DateTime.convertirEnValueType(mainlevée.instruction.démarréeLe),
        démarréePar: Email.convertirEnValueType(mainlevée.instruction.démarréePar),
      }
    : undefined,
  accord: mainlevée.accord
    ? {
        accordéeLe: DateTime.convertirEnValueType(mainlevée.accord.accordéeLe),
        accordéePar: Email.convertirEnValueType(mainlevée.accord.accordéePar),
        courrierAccord: DocumentProjet.convertirEnValueType(
          IdentifiantProjet.convertirEnValueType(mainlevée.identifiantProjet).formatter(),
          TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
          mainlevée.accord.accordéeLe,
          mainlevée.accord.courrierAccord.format,
        ),
      }
    : undefined,
  rejet: mainlevée.rejet
    ? {
        rejetéLe: DateTime.convertirEnValueType(mainlevée.rejet.rejetéLe),
        rejetéPar: Email.convertirEnValueType(mainlevée.rejet.rejetéPar),
        courrierRejet: DocumentProjet.convertirEnValueType(
          mainlevée.identifiantProjet,
          TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeRejetéeValueType.formatter(),
          mainlevée.rejet.rejetéLe,
          mainlevée.rejet.courrierRejet.format,
        ),
      }
    : undefined,
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(mainlevée.dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(mainlevée.dernièreMiseÀJour.par),
  },
});

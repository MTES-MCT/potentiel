import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, RangeOptions, Joined } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import {
  MainlevéeGarantiesFinancièresEntity,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';
import {
  getRoleBasedWhereCondition,
  Utilisateur,
} from '../../../_utils/getRoleBasedWhereCondition';
import { LauréatEntity } from '../../../lauréat.entity';

export type ListerMainlevéeItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.ValueType;
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
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
  {
    range?: RangeOptions;
    appelOffre?: string;
    motif?: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
    statut?: StatutMainlevéeGarantiesFinancières.RawType;
    estEnCours?: boolean;
  } & (
    | {
        utilisateur?: Utilisateur;
        identifiantProjet: IdentifiantProjet.RawType;
      }
    | {
        utilisateur: Utilisateur;
        identifiantProjet?: IdentifiantProjet.RawType;
      }
  ),
  ListerMainlevéesReadModel
>;

export type ListerMainlevéesQueryDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerMainlevéesQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerMainlevéesQueryDependencies) => {
  const handler: MessageHandler<ListerMainlevéesQuery> = async ({
    range,
    identifiantProjet,
    appelOffre,
    motif,
    statut,
    estEnCours,
    utilisateur,
  }) => {
    const roleBasedCondition = utilisateur
      ? await getRoleBasedWhereCondition(utilisateur, récupérerIdentifiantsProjetParEmailPorteur)
      : {};

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<MainlevéeGarantiesFinancièresEntity, LauréatEntity>(
      'mainlevee-garanties-financieres',
      {
        range,
        where: {
          identifiantProjet: identifiantProjet
            ? Where.equal(identifiantProjet)
            : roleBasedCondition.identifiantProjet,
          motif: Where.equal(motif),
          statut: estEnCours
            ? Where.notEqual(StatutMainlevéeGarantiesFinancières.rejeté.statut)
            : Where.equal(statut),
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: Where.equal(appelOffre),
            localité: { région: roleBasedCondition.régionProjet },
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
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Lister', handler);
};

const listerMainlevéeGarantiesFinancièresMapToReadModel = (
  mainlevée: MainlevéeGarantiesFinancièresEntity & Joined<LauréatEntity>,
): ListerMainlevéeItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(mainlevée.identifiantProjet),
  appelOffre: mainlevée.lauréat.appelOffre,
  nomProjet: mainlevée.lauréat.nomProjet,
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut),
  motif:
    Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
      mainlevée.motif,
    ),
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
          TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
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
          TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
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

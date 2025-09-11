import { Message, MessageHandler, mediator } from 'mediateur';

import { Where, List, Joined } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../../..';
import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseMainlevée,
} from '../..';
import { LauréatEntity } from '../../..';

export type ConsulterMainlevéeEnCoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
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
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: Email.ValueType;
  };
};

export type ConsulterMainlevéeEnCoursQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterMainlevéeEnCoursReadModel>
>;

export type ListerMainlevéesQueryDependencies = {
  list: List;
};

export const registerConsulterMainlevéeEnCoursQuery = ({
  list,
}: ListerMainlevéesQueryDependencies) => {
  const handler: MessageHandler<ConsulterMainlevéeEnCoursQuery> = async ({ identifiantProjet }) => {
    const mainlevées = await list<MainlevéeGarantiesFinancièresEntity, LauréatEntity>(
      `mainlevee-garanties-financieres`,
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjet),
          statut: Where.notEqual(StatutMainlevéeGarantiesFinancières.rejeté.statut),
        },
        range: { startPosition: 0, endPosition: 1 },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {},
        },
      },
    );
    if (mainlevées.items.length === 0) {
      return Option.none;
    }
    const mainlevée = mainlevées.items[0];

    return mapToReadModel(mainlevée);
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours', handler);
};

const mapToReadModel = (
  mainlevée: MainlevéeGarantiesFinancièresEntity & Joined<LauréatEntity>,
): ConsulterMainlevéeEnCoursReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(mainlevée.identifiantProjet),
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
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(mainlevée.dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(mainlevée.dernièreMiseÀJour.par),
  },
});

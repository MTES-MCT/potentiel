import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';

export type ConsulterMainlevéeGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  nomProjet: string;
  appelOffre: string;
  famille?: string;
  période: string;
  régionProjet: string;
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
    refuséeLe: DateTime.ValueType;
    refuséePar: Email.ValueType;
    courrierRejet: DocumentProjet.ValueType;
  };
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: Email.ValueType;
  };
};

export type ConsulterMainlevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterMainlevéeGarantiesFinancièresReadModel>
>;

export type ConsulterMainlevéeGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterMainlevéeGarantiesFinancièresQuery = ({
  find,
}: ConsulterMainlevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterMainlevéeGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjetValueType =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return consulterMainlevéeGarantiesFinancièresMapToReadModel(result);
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const consulterMainlevéeGarantiesFinancièresMapToReadModel = ({
  motif,
  demande,
  dernièreMiseÀJour,
  statut,
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  instruction,
  accord,
}: MainlevéeGarantiesFinancièresEntity): ConsulterMainlevéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  demande: {
    demandéeLe: DateTime.convertirEnValueType(demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(demande.demandéePar),
  },
  instruction: instruction
    ? {
        démarréePar: Email.convertirEnValueType(instruction?.démarréePar),
        démarréeLe: DateTime.convertirEnValueType(instruction.démarréeLe),
      }
    : undefined,
  accord: accord
    ? {
        accordéeLe: DateTime.convertirEnValueType(accord.accordéeLe),
        accordéePar: Email.convertirEnValueType(accord.accordéePar),
        courrierAccord: DocumentProjet.convertirEnValueType(
          IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
          accord.accordéeLe,
          accord.courrierAccord.format,
        ),
      }
    : undefined,
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motif),
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(dernièreMiseÀJour.par),
  },
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import {
  MainLevéeGarantiesFinancièresEntity,
  MotifDemandeMainLevéeGarantiesFinancières,
  StatutMainLevéeGarantiesFinancières,
} from '../..';

export type ConsulterMainLevéeGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutMainLevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainLevéeGarantiesFinancières.ValueType;
  demande: { demandéeLe: DateTime.ValueType; demandéePar: Email.ValueType };
  instruction?: {
    instructionDémarréeLe: DateTime.ValueType;
    instructionDémarréePar: Email.ValueType;
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

export type ConsulterMainLevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Query.Consulter',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterMainLevéeGarantiesFinancièresReadModel>
>;

export type ConsulterMainLevéeGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterMainLevéeGarantiesFinancièresQuery = ({
  find,
}: ConsulterMainLevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterMainLevéeGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<MainLevéeGarantiesFinancièresEntity>(
      `main-levee-garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return consulterMainLevéeGarantiesFinancièresMapToReadModel(result);
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Query.Consulter', handler);
};

export const consulterMainLevéeGarantiesFinancièresMapToReadModel = ({
  motif,
  demande,
  dernièreMiseÀJour,
  statut,
  identifiantProjet,
}: MainLevéeGarantiesFinancièresEntity): ConsulterMainLevéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  demande: {
    demandéeLe: DateTime.convertirEnValueType(demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(demande.demandéePar),
  },
  motif: MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motif),
  statut: StatutMainLevéeGarantiesFinancières.convertirEnValueType(statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(dernièreMiseÀJour.par),
  },
});

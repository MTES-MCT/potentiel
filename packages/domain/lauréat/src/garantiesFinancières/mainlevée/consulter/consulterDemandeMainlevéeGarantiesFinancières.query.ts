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

export type ConsulterDemandeMainlevéeGarantiesFinancièresReadModel = {
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
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: Email.ValueType;
  };
};

export type ConsulterDemandeMainlevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDemandeMainlevéeGarantiesFinancièresReadModel>
>;

export type ConsulterDemandeMainlevéeGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterDemandeMainlevéeGarantiesFinancièresQuery = ({
  find,
}: ConsulterDemandeMainlevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterDemandeMainlevéeGarantiesFinancièresQuery> = async ({
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

    return consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel(result);
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel = ({
  motif,
  demandéLe,
  demandéPar,
  statut,
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  dateMiseÀJour,
  misÀJourPar,
}: MainlevéeGarantiesFinancièresEntity): ConsulterDemandeMainlevéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  demande: {
    demandéeLe: DateTime.convertirEnValueType(demandéLe),
    demandéePar: Email.convertirEnValueType(demandéPar),
  },
  instruction:
    statut.type === 'en-instruction'
      ? {
          démarréePar: Email.convertirEnValueType(statut.instructionDémarréPar),
          démarréeLe: DateTime.convertirEnValueType(statut.instructionDémarréLe),
        }
      : undefined,
  accord:
    statut.type === 'accordé'
      ? {
          accordéeLe: DateTime.convertirEnValueType(statut.accordéLe),
          accordéePar: Email.convertirEnValueType(statut.accordéPar),
          courrierAccord: DocumentProjet.convertirEnValueType(
            IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
            TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
            statut.accordéLe,
            statut.courrierRéponse.format,
          ),
        }
      : undefined,
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motif),
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut.type),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dateMiseÀJour),
    par: Email.convertirEnValueType(misÀJourPar),
  },
});

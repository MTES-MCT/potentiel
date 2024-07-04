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
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  dernièreMiseÀJourLe,
  dernièreMiseÀJourPar,
  ...mainlevée
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
    mainlevée.statut === 'en-instruction'
      ? {
          démarréePar: Email.convertirEnValueType(mainlevée.instructionDémarréPar),
          démarréeLe: DateTime.convertirEnValueType(mainlevée.instructionDémarréLe),
        }
      : undefined,
  accord:
    mainlevée.statut === 'accordé'
      ? {
          accordéeLe: DateTime.convertirEnValueType(mainlevée.accordéLe),
          accordéePar: Email.convertirEnValueType(mainlevée.accordéPar),
          courrierAccord: DocumentProjet.convertirEnValueType(
            IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
            TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
            mainlevée.accordéLe,
            mainlevée.courrierRéponse.format,
          ),
        }
      : undefined,
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motif),
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJourLe),
    par: Email.convertirEnValueType(dernièreMiseÀJourPar),
  },
});

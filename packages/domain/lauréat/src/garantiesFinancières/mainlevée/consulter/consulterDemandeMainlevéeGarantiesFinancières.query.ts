import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';

import {
  GarantiesFinancièresEntity,
  MainlevéeAccordée,
  MainlevéeDemandée,
  MainlevéeEnInstruction,
  MainlevéeRejetée,
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

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    if (Option.isNone(result) || result.mainlevée.statut === 'aucun') {
      return Option.none;
    }

    return consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel(
      identifiantProjetValue,
      result.projet,
      result.mainlevée,
    );
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel = (
  identifiantProjet: string,
  { nomProjet, régionProjet, appelOffre, famille, période }: GarantiesFinancièresEntity['projet'],
  mainlevée: MainlevéeDemandée | MainlevéeEnInstruction | MainlevéeAccordée | MainlevéeRejetée,
): ConsulterDemandeMainlevéeGarantiesFinancièresReadModel => {
  const { statut, motif, demande, miseÀJour } = mainlevée;

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    appelOffre,
    famille,
    période,
    régionProjet,
    demande: {
      demandéeLe: DateTime.convertirEnValueType(demande.demandéLe),
      demandéePar: Email.convertirEnValueType(demande.demandéPar),
    },
    instruction:
      statut === 'en-instruction'
        ? {
            démarréeLe: DateTime.convertirEnValueType(mainlevée.instructionDémarréLe),
            démarréePar: Email.convertirEnValueType(mainlevée.instructionDémarréPar),
          }
        : undefined,
    accord:
      statut === 'accordé'
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
    statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(miseÀJour.dernièreMiseÀJourLe),
      par: Email.convertirEnValueType(miseÀJour.dernièreMiseÀJourPar),
    },
  };
};

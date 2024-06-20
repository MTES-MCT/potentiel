import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';

import {
  HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  appelOffre: string;
  famille?: string;
  période: string;
  régionProjet: string;
  historique: Array<{
    motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
    demande: { demandéeLe: DateTime.ValueType; demandéePar: Email.ValueType };
    rejet: {
      rejetéeLe: DateTime.ValueType;
      rejetéePar: Email.ValueType;
      courrierRejet: DocumentProjet.ValueType;
    };
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: Email.ValueType;
    };
  }>;
};

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>
>;

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery = ({
  find,
}: ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<
    ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery
  > = async ({ identifiantProjetValue }) => {
    const identifiantProjetValueType =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity>(
      `historique-mainlevee-rejetee-garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return mapToReadModel(result);
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
    handler,
  );
};

export const mapToReadModel = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  historique,
}: HistoriqueMainlevéeRejetéeGarantiesFinancièresEntity): ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  historique: historique.map((demandeRejetée) => ({
    demande: {
      demandéeLe: DateTime.convertirEnValueType(demandeRejetée.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(demandeRejetée.demande.demandéePar),
    },
    motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(demandeRejetée.motif),
    rejet: {
      rejetéeLe: DateTime.convertirEnValueType(demandeRejetée.rejet.rejetéeLe),
      rejetéePar: Email.convertirEnValueType(demandeRejetée.rejet.rejetéePar),
      courrierRejet: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
        demandeRejetée.rejet.rejetéeLe,
        demandeRejetée.rejet.courrierRejet.format,
      ),
    },
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(demandeRejetée.dernièreMiseÀJour.date),
      par: Email.convertirEnValueType(demandeRejetée.dernièreMiseÀJour.par),
    },
  })),
});

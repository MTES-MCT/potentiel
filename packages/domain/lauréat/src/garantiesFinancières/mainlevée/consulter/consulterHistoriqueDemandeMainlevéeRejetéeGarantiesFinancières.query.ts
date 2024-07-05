import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';

import {
  GarantiesFinancièresEntity,
  MainlevéeRejetée,
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
      rejetéLe: DateTime.ValueType;
      rejetéPar: Email.ValueType;
      courrierRejet: DocumentProjet.ValueType;
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

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    if (
      Option.isNone(result) ||
      result.mainlevée.statut === 'aucun' ||
      result.mainlevée.instructionsRejetées.length === 0
    ) {
      return Option.none;
    }

    return mapToReadModel(
      identifiantProjetValue,
      result.projet,
      result.mainlevée.instructionsRejetées,
    );
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
    handler,
  );
};

export const mapToReadModel = (
  identifiantProjet: string,
  { nomProjet, régionProjet, appelOffre, famille, période }: GarantiesFinancièresEntity['projet'],
  historiqueMainlevéeRejetée: Array<MainlevéeRejetée>,
): ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  historique: historiqueMainlevéeRejetée.map((mainlevéeRejetée) => ({
    demande: {
      demandéeLe: DateTime.convertirEnValueType(mainlevéeRejetée.demande.demandéLe),
      demandéePar: Email.convertirEnValueType(mainlevéeRejetée.demande.demandéPar),
    },
    motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(mainlevéeRejetée.motif),
    rejet: {
      rejetéLe: DateTime.convertirEnValueType(mainlevéeRejetée.rejetéLe),
      rejetéPar: Email.convertirEnValueType(mainlevéeRejetée.rejetéPar),
      courrierRejet: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
        mainlevéeRejetée.rejetéLe,
        mainlevéeRejetée.courrierRéponse.format,
      ),
    },
  })),
});

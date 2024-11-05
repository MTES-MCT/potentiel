import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/entity';

import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';

// l'historique des mainlevée est le tableau des mainlevée ayant un statut rejetée
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

    const result = await find<MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    const hasNoHistoriqueMainlevée =
      Option.isNone(result) ||
      result.détailsMainlevées.filter((mainlevée) => mainlevée.statut === 'rejeté').length < 1;

    if (hasNoHistoriqueMainlevée) {
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
  projet: { nomProjet, appelOffre, famille, période, régionProjet },
  détailsMainlevées,
}: MainlevéeGarantiesFinancièresEntity): ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  historique: détailsMainlevées
    .filter((mainlevée) =>
      StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut).estRejeté(),
    )
    .map((mainlevéeRejetée) => ({
      demande: {
        demandéeLe: DateTime.convertirEnValueType(mainlevéeRejetée.demande.demandéeLe),
        demandéePar: Email.convertirEnValueType(mainlevéeRejetée.demande.demandéePar),
      },
      motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(mainlevéeRejetée.motif),
      rejet: {
        rejetéLe: DateTime.convertirEnValueType(mainlevéeRejetée.rejet!.rejetéLe),
        rejetéPar: Email.convertirEnValueType(mainlevéeRejetée.rejet!.rejetéPar),
        courrierRejet: DocumentProjet.convertirEnValueType(
          identifiantProjet,
          TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
          mainlevéeRejetée.rejet!.rejetéLe,
          mainlevéeRejetée.rejet!.courrierRejet.format,
        ),
      },
    })),
});

import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/entity';

import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';

// garder la query consulter historique
// query c'est les mainlevéeRejetée avec un statut rejetée
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

// modifier ça
// ne pas bouger la consultations
export const mapToReadModel = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  mainlevées,
}: MainlevéeGarantiesFinancièresEntity): ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
  historique: mainlevées
    .map((mainlevéeRejetée) => {
      // tricks because predicate does not work
      return mainlevéeRejetée.statut === 'rejeté'
        ? {
            demande: {
              demandéeLe: DateTime.convertirEnValueType(mainlevéeRejetée.demande.demandéeLe),
              demandéePar: Email.convertirEnValueType(mainlevéeRejetée.demande.demandéePar),
            },
            motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
              mainlevéeRejetée.motif,
            ),
            rejet: {
              rejetéLe: DateTime.convertirEnValueType(mainlevéeRejetée.rejet.rejetéLe),
              rejetéPar: Email.convertirEnValueType(mainlevéeRejetée.rejet.rejetéPar),
              courrierRejet: DocumentProjet.convertirEnValueType(
                identifiantProjet,
                TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
                mainlevéeRejetée.rejet!.rejetéLe,
                mainlevéeRejetée.rejet!.courrierRejet.format,
              ),
            },
          }
        : undefined;
    })
    .filter((item) => item !== undefined),
});

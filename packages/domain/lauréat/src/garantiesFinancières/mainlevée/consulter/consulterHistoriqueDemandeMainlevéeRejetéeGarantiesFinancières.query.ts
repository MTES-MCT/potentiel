import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { List, Where } from '@potentiel-domain/entity';

import {
  MainlevéeGarantiesFinancièresEntity,
  MotifDemandeMainlevéeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeDocumentRéponseDemandeMainlevée,
} from '../..';

type ConsulterDemandeMainlevéeRejetéeGarantiesFinancièresReadModel = {
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  demande: { demandéeLe: DateTime.ValueType; demandéePar: Email.ValueType };
  rejet: {
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    courrierRejet: DocumentProjet.ValueType;
  };
};

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel =
  Array<ConsulterDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>;

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>
>;

export type ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies = {
  list: List;
};

export const registerConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery = ({
  list,
}: ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<
    ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery
  > = async ({ identifiantProjetValue }) => {
    const identifiantProjetValueType =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const { items: historique } = await list<MainlevéeGarantiesFinancièresEntity>(
      'mainlevee-garanties-financieres',
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjetValueType.formatter()),
          // l'historique des mainlevée est le tableau des mainlevée ayant un statut rejetée
          statut: Where.equal(StatutMainlevéeGarantiesFinancières.rejeté.statut),
        },
      },
    );

    if (!historique.length) {
      return Option.none;
    }

    return historique.map(mapToReadModel);
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
    handler,
  );
};

const mapToReadModel = (
  mainlevéeRejetée: MainlevéeGarantiesFinancièresEntity,
): ConsulterDemandeMainlevéeRejetéeGarantiesFinancièresReadModel => ({
  demande: {
    demandéeLe: DateTime.convertirEnValueType(mainlevéeRejetée.demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(mainlevéeRejetée.demande.demandéePar),
  },
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(mainlevéeRejetée.motif),
  rejet: {
    rejetéLe: DateTime.convertirEnValueType(mainlevéeRejetée.rejet!.rejetéLe),
    rejetéPar: Email.convertirEnValueType(mainlevéeRejetée.rejet!.rejetéPar),
    courrierRejet: DocumentProjet.convertirEnValueType(
      mainlevéeRejetée.identifiantProjet,
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter(),
      mainlevéeRejetée.rejet!.rejetéLe,
      mainlevéeRejetée.rejet!.courrierRejet.format,
    ),
  },
});

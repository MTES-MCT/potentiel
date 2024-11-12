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

export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel = {
  statut: StatutMainlevéeGarantiesFinancières.ValueType;
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
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

export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel>
>;

export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies = {
  list: List;
};

export const registerConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery = ({
  list,
}: ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<
    ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery
  > = async ({ identifiantProjetValue }) => {
    const identifiantProjetValueType =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const { items } = await list<MainlevéeGarantiesFinancièresEntity>(
      'mainlevee-garanties-financieres',
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjetValueType.formatter()),
          // une demande de mainlevée en cours est une mainlevée qui n'a pas été rejetée
          statut: Where.notEqual(StatutMainlevéeGarantiesFinancières.rejeté.statut),
        },
      },
    );

    // il ne doit exister qu'une demande de mainlevée maximum par identifiant projet
    if (!items.length || items.length > 1) {
      return Option.none;
    }

    return ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresMapToReadModel(items[0]);
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresMapToReadModel = (
  mainlevée: MainlevéeGarantiesFinancièresEntity,
): ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel => ({
  demande: {
    demandéeLe: DateTime.convertirEnValueType(mainlevée.demande.demandéeLe),
    demandéePar: Email.convertirEnValueType(mainlevée.demande.demandéePar),
  },
  instruction: mainlevée.instruction
    ? {
        démarréePar: Email.convertirEnValueType(mainlevée.instruction.démarréePar),
        démarréeLe: DateTime.convertirEnValueType(mainlevée.instruction.démarréeLe),
      }
    : undefined,
  accord: mainlevée.accord
    ? {
        accordéeLe: DateTime.convertirEnValueType(mainlevée.accord.accordéeLe),
        accordéePar: Email.convertirEnValueType(mainlevée.accord.accordéePar),
        courrierAccord: DocumentProjet.convertirEnValueType(
          IdentifiantProjet.convertirEnValueType(mainlevée.identifiantProjet).formatter(),
          TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
          mainlevée.accord.accordéeLe,
          mainlevée.accord.courrierAccord.format,
        ),
      }
    : undefined,
  motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.motif),
  statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(mainlevée.dernièreMiseÀJour.date),
    par: Email.convertirEnValueType(mainlevée.dernièreMiseÀJour.par),
  },
});

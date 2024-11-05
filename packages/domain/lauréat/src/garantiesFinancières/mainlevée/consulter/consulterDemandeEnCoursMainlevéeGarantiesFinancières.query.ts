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

// une demande de mainlevée en cours est une mainlevée qui n'a pas été rejetée
export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel = {
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

export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel>
>;

export type ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery = ({
  find,
}: ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<
    ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery
  > = async ({ identifiantProjetValue }) => {
    const identifiantProjetValueType =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${identifiantProjetValueType.formatter()}`,
    );

    if (
      Option.isNone(result) ||
      !result.détailsMainlevées.filter(
        (mainlevée) =>
          !StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut).estRejeté(),
      ).length
    ) {
      return Option.none;
    }

    return ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresMapToReadModel(result);
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresMapToReadModel = ({
  détailsMainlevées,
  identifiantProjet,
  projet: { nomProjet, appelOffre, famille, période, régionProjet },
}: MainlevéeGarantiesFinancièresEntity): ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel => {
  const mainlevéeEnCours = détailsMainlevées
    .filter(
      (mainlevée) =>
        !StatutMainlevéeGarantiesFinancières.convertirEnValueType(mainlevée.statut).estRejeté(),
    )
    .map((mainlevée) => {
      return {
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
                IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
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
      };
    });

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    appelOffre,
    famille,
    période,
    régionProjet,
    ...mainlevéeEnCours[0],
  };
};

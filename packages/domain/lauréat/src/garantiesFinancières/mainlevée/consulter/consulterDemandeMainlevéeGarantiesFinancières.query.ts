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

    const hasNoMainlevéeEnCours =
      Option.isNone(result) ||
      result.mainlevées.filter((mainlevée) => mainlevée.statut !== 'rejeté').length < 1;

    if (hasNoMainlevéeEnCours) {
      return Option.none;
    }

    return consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel(result);
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter', handler);
};

export const consulterDemandeMainlevéeGarantiesFinancièresMapToReadModel = ({
  mainlevées,
  identifiantProjet,
  nomProjet,
  appelOffre,
  famille,
  période,
  régionProjet,
}: MainlevéeGarantiesFinancièresEntity): ConsulterDemandeMainlevéeGarantiesFinancièresReadModel => {
  const mainlevéeEnCours = mainlevées
    .map((mainlevée) => {
      // tricks because predicate does not work
      return mainlevée.statut !== 'rejeté'
        ? {
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
          }
        : undefined;
    })
    .filter((item) => item !== undefined);

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

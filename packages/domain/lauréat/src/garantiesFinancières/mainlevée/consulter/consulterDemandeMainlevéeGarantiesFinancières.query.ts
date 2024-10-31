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

    if (Option.isNone(result)) {
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
    .map((mainlevéeEnCours) => {
      // tricks because predicate does not work
      return ['accordé', 'en-instruction', 'demandé'].includes(mainlevéeEnCours.statut)
        ? {
            demande: {
              demandéeLe: DateTime.convertirEnValueType(mainlevéeEnCours.demande.demandéeLe),
              demandéePar: Email.convertirEnValueType(mainlevéeEnCours.demande.demandéePar),
            },
            instruction: mainlevéeEnCours.instruction
              ? {
                  démarréePar: Email.convertirEnValueType(instruction?.démarréePar),
                  démarréeLe: DateTime.convertirEnValueType(instruction.démarréeLe),
                }
              : undefined,
            accord: accord
              ? {
                  accordéeLe: DateTime.convertirEnValueType(accord.accordéeLe),
                  accordéePar: Email.convertirEnValueType(accord.accordéePar),
                  courrierAccord: DocumentProjet.convertirEnValueType(
                    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
                    TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
                    accord.accordéeLe,
                    accord.courrierAccord.format,
                  ),
                }
              : undefined,
            motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motif),
            statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut),
            dernièreMiseÀJour: {
              date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
              par: Email.convertirEnValueType(dernièreMiseÀJour.par),
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
    demande: {
      demandéeLe: DateTime.convertirEnValueType(mainlevéeEnCours.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(mainlevéeEnCours.demande.demandéePar),
    },
    instruction: mainlevéeEnCours.instruction
      ? {
          démarréePar: Email.convertirEnValueType(instruction?.démarréePar),
          démarréeLe: DateTime.convertirEnValueType(instruction.démarréeLe),
        }
      : undefined,
    accord: accord
      ? {
          accordéeLe: DateTime.convertirEnValueType(accord.accordéeLe),
          accordéePar: Email.convertirEnValueType(accord.accordéePar),
          courrierAccord: DocumentProjet.convertirEnValueType(
            IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
            TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
            accord.accordéeLe,
            accord.courrierAccord.format,
          ),
        }
      : undefined,
    motif: MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motif),
    statut: StatutMainlevéeGarantiesFinancières.convertirEnValueType(statut),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      par: Email.convertirEnValueType(dernièreMiseÀJour.par),
    },
  };
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  AutoritéCompétente,
  DemandeAbandonEntity,
  DocumentAbandon,
  StatutAbandon,
  StatutPreuveRecandidature,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterDemandeAbandonReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutAbandon.ValueType;
  demande: {
    demandéPar: Email.ValueType;
    demandéLe: DateTime.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;

    estUneRecandidature: boolean;

    recandidature?: {
      statut: StatutPreuveRecandidature.ValueType;
      preuve?: {
        demandéeLe: DateTime.ValueType;
        identifiantProjet?: IdentifiantProjet.ValueType;
        transmiseLe?: DateTime.ValueType;
        transmisePar?: Email.ValueType;
      };
    };

    instruction?: {
      passéEnInstructionLe: DateTime.ValueType;
      passéEnInstructionPar: Email.ValueType;
    };

    confirmation?: {
      demandéePar: Email.ValueType;
      demandéeLe: DateTime.ValueType;

      réponseSignée: DocumentProjet.ValueType;

      confirméLe?: DateTime.ValueType;
      confirméPar?: Email.ValueType;
    };

    accord?: {
      réponseSignée: DocumentProjet.ValueType;
      accordéPar: Email.ValueType;
      accordéLe: DateTime.ValueType;
    };

    rejet?: {
      réponseSignée: DocumentProjet.ValueType;
      rejetéPar: Email.ValueType;
      rejetéLe: DateTime.ValueType;
    };

    autoritéCompétente: AutoritéCompétente.ValueType;
  };
};

export type ConsulterDemandeAbandonQuery = Message<
  'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
  {
    identifiantProjetValue: string;
    autoritéCompétente?: string;
    demandéLeValue: string;
  },
  Option.Type<ConsulterDemandeAbandonReadModel>
>;

export type ConsulterDemandeAbandonDependencies = {
  find: Find;
};

export const registerConsulterDemandeAbandonQuery = ({
  find,
}: ConsulterDemandeAbandonDependencies) => {
  const handler: MessageHandler<ConsulterDemandeAbandonQuery> = async ({
    identifiantProjetValue,
    demandéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<DemandeAbandonEntity>(
      `demande-abandon|${identifiantProjet.formatter()}#${demandéLeValue}`,
    );

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Abandon.Query.ConsulterDemandeAbandon', handler);
};

const mapToReadModel = (result: DemandeAbandonEntity) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(result.identifiantProjet);
  return {
    demande: {
      demandéLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéPar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      estUneRecandidature: !!result.demande.recandidature,
      pièceJustificative: result.demande.pièceJustificative
        ? DocumentAbandon.pièceJustificative({
            identifiantProjet: result.identifiantProjet,
            demandéLe: result.demande.demandéLe,
            pièceJustificative: result.demande.pièceJustificative,
          })
        : undefined,
      recandidature: result.demande.recandidature
        ? {
            statut: StatutPreuveRecandidature.convertirEnValueType(
              result.demande.recandidature.statut,
            ),
            preuve: result.demande.recandidature.preuve
              ? {
                  demandéeLe: DateTime.convertirEnValueType(
                    result.demande.recandidature.preuve.demandéeLe,
                  ),
                  transmiseLe: result.demande.recandidature.preuve.transmiseLe
                    ? DateTime.convertirEnValueType(result.demande.recandidature.preuve.transmiseLe)
                    : undefined,
                  transmisePar: result.demande.recandidature.preuve.transmisePar
                    ? Email.convertirEnValueType(result.demande.recandidature.preuve.transmisePar)
                    : undefined,
                  identifiantProjet: result.demande.recandidature.preuve.identifiantProjet
                    ? IdentifiantProjet.convertirEnValueType(
                        result.demande.recandidature.preuve.identifiantProjet,
                      )
                    : undefined,
                }
              : undefined,
          }
        : undefined,
      confirmation: result.demande.confirmation
        ? {
            demandéeLe: DateTime.convertirEnValueType(result.demande.confirmation.demandéeLe),
            demandéePar: Email.convertirEnValueType(result.demande.confirmation.demandéePar),
            réponseSignée: DocumentAbandon.abandonAConfirmer({
              identifiantProjet: result.identifiantProjet,
              confirmationDemandéeLe: result.demande.confirmation.demandéeLe,
              réponseSignée: result.demande.confirmation.réponseSignée,
            }),
            confirméLe: result.demande.confirmation.confirméLe
              ? DateTime.convertirEnValueType(result.demande.confirmation.confirméLe)
              : undefined,
            confirméPar: result.demande.confirmation.confirméPar
              ? Email.convertirEnValueType(result.demande.confirmation.confirméPar)
              : undefined,
          }
        : undefined,
      instruction: result.demande.instruction
        ? {
            passéEnInstructionLe: DateTime.convertirEnValueType(
              result.demande.instruction.passéEnInstructionLe,
            ),
            passéEnInstructionPar: Email.convertirEnValueType(
              result.demande.instruction.passéEnInstructionPar,
            ),
          }
        : undefined,
      accord: result.demande.accord
        ? {
            accordéLe: DateTime.convertirEnValueType(result.demande.accord.accordéLe),
            accordéPar: Email.convertirEnValueType(result.demande.accord.accordéPar),
            réponseSignée: DocumentAbandon.abandonAccordé({
              identifiantProjet: identifiantProjet.formatter(),
              ...result.demande.accord,
            }),
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéLe),
            rejetéPar: Email.convertirEnValueType(result.demande.rejet.rejetéPar),
            réponseSignée: DocumentAbandon.abandonRejeté({
              identifiantProjet: result.identifiantProjet,
              rejetéLe: result.demande.rejet.rejetéLe,
              réponseSignée: result.demande.rejet.réponseSignée,
            }),
          }
        : undefined,
      autoritéCompétente: AutoritéCompétente.convertirEnValueType(
        result.demande.autoritéCompétente,
      ),
    },
    identifiantProjet,
    statut: StatutAbandon.convertirEnValueType(result.statut),
  } satisfies ConsulterDemandeAbandonReadModel;
};

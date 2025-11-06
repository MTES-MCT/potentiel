import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import * as StatutRecours from '../statutRecours.valueType';
import { RecoursEntity } from '../recours.entity';
import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';
import { DocumentProjet, IdentifiantProjet } from '../../..';

export type ConsulterRecoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutRecours.ValueType;
  demande: {
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
    instruction?: {
      passéEnInstructionLe: DateTime.ValueType;
      passéEnInstructionPar: Email.ValueType;
    };
    accord?: {
      accordéLe: DateTime.ValueType;
      accordéPar: Email.ValueType;
      réponseSignée: DocumentProjet.ValueType;
    };
    rejet?: {
      rejetéLe: DateTime.ValueType;
      rejetéPar: Email.ValueType;
      réponseSignée: DocumentProjet.ValueType;
    };
  };
};

export type ConsulterRecoursQuery = Message<
  'Éliminé.Recours.Query.ConsulterRecours',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterRecoursReadModel>
>;

export type ConsulterRecoursDependencies = {
  find: Find;
};

export const registerConsulterRecoursQuery = ({ find }: ConsulterRecoursDependencies) => {
  const handler: MessageHandler<ConsulterRecoursQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<RecoursEntity>(`recours|${identifiantProjet.formatter()}`);

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register('Éliminé.Recours.Query.ConsulterRecours', handler);
};

const mapToReadModel = (result: RecoursEntity) => {
  return {
    demande: {
      demandéLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéPar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentRecours.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéLe).formatter(),
        result.demande.pièceJustificative?.format,
      ),
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
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentRecours.recoursAccordé.formatter(),
              DateTime.convertirEnValueType(result.demande.accord.accordéLe).formatter(),
              result.demande.accord.réponseSignée.format,
            ),
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéLe),
            rejetéPar: Email.convertirEnValueType(result.demande.rejet.rejetéPar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentRecours.recoursRejeté.formatter(),
              DateTime.convertirEnValueType(result.demande.rejet.rejetéLe).formatter(),
              result.demande.rejet.réponseSignée.format,
            ),
          }
        : undefined,
    },
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    statut: StatutRecours.convertirEnValueType(result.statut),
  } satisfies ConsulterRecoursReadModel;
};

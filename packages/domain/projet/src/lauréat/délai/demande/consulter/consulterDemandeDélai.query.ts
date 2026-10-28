import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { Délai } from '../../../index.js';
import { AutoritéCompétente, DocumentDélai, type StatutDemandeDélai } from '../../index.js';
import type { DemandeDélaiEntity } from '../demandeDélai.entity.js';

export type ConsulterDemandeDélaiReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  statut: StatutDemandeDélai.ValueType;

  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;

  nombreDeMois: number;
  raison: string;

  pièceJustificative: DocumentProjet.ValueType;

  autoritéCompétente?: AutoritéCompétente.ValueType;

  instruction?: {
    passéeEnInstructionLe: DateTime.ValueType;
    passéeEnInstructionPar: Email.ValueType;
  };

  accord?: {
    accordéePar: Email.ValueType;
    accordéeLe: DateTime.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    nombreDeMois: number;
    dateAchèvementPrévisionnelCalculée: DateTime.ValueType;
  };

  rejet?: {
    rejetéePar: Email.ValueType;
    rejetéeLe: DateTime.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  };
};

export type ConsulterDemandeDélaiQuery = Message<
  'Lauréat.Délai.Query.ConsulterDemandeDélai',
  { identifiantProjet: string; demandéLe: string },
  Option.Type<ConsulterDemandeDélaiReadModel>
>;

export type ConsulterDemandeDélaiDependencies = { find: Find };

export const registerConsulterDemandeDélaiQuery = ({ find }: ConsulterDemandeDélaiDependencies) => {
  const handler: MessageHandler<ConsulterDemandeDélaiQuery> = async ({
    identifiantProjet,
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeDélai = await find<DemandeDélaiEntity>(
      `demande-délai|${identifiantProjetValueType.formatter()}#${demandéLe}`,
    );

    return Option.match(demandeDélai)
      .some((demandeDélai) =>
        mapToReadModel({ identifiantProjet: identifiantProjetValueType, demandeDélai }),
      )
      .none();
  };
  mediator.register('Lauréat.Délai.Query.ConsulterDemandeDélai', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  demandeDélai: DemandeDélaiEntity;
}) => ConsulterDemandeDélaiReadModel;

const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  demandeDélai: {
    statut,
    autoritéCompétente,
    demande: {
      demandéLe,
      demandéPar,
      nombreDeMois,
      raison,
      pièceJustificative: { format },
      instruction,
      accord,
      rejet,
    },
  },
}) => {
  return {
    identifiantProjet,
    statut: Délai.StatutDemandeDélai.convertirEnValueType(statut),
    pièceJustificative: DocumentDélai.pièceJustificative({
      identifiantProjet: identifiantProjet.formatter(),
      demandéLe,
      pièceJustificative: {
        format,
      },
    }),
    demandéLe: DateTime.convertirEnValueType(demandéLe),
    demandéPar: Email.convertirEnValueType(demandéPar),

    autoritéCompétente:
      autoritéCompétente && AutoritéCompétente.convertirEnValueType(autoritéCompétente),
    nombreDeMois,
    raison,

    instruction: instruction && {
      passéeEnInstructionLe: DateTime.convertirEnValueType(instruction.passéeEnInstructionLe),
      passéeEnInstructionPar: Email.convertirEnValueType(instruction.passéeEnInstructionPar),
    },

    rejet: rejet && {
      motif: rejet.motif,
      rejetéePar: Email.convertirEnValueType(rejet.rejetéPar),
      rejetéeLe: DateTime.convertirEnValueType(rejet.rejetéLe),
      réponseSignée: DocumentDélai.demandeRejetée({
        identifiantProjet: identifiantProjet.formatter(),
        rejetéeLe: rejet.rejetéLe,
        réponseSignée: {
          format: rejet.réponseSignée.format,
        },
      }),
    },

    accord: accord && {
      accordéePar: Email.convertirEnValueType(accord.accordéPar),
      accordéeLe: DateTime.convertirEnValueType(accord.accordéLe),
      nombreDeMois: accord.nombreDeMois,
      dateAchèvementPrévisionnelCalculée: DateTime.convertirEnValueType(
        accord.dateAchèvementPrévisionnelCalculée,
      ),
      réponseSignée: DocumentDélai.demandeAccordée({
        identifiantProjet: identifiantProjet.formatter(),
        accordéLe: accord.accordéLe,
        réponseSignée: {
          format: accord.réponseSignée.format,
        },
      }),
    },
  };
};

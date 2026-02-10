import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { AutoritéCompétente, StatutDemandeDélai } from '../../index.js';
import { Délai } from '../../../index.js';
import { DemandeDélaiEntity } from '../demandeDélai.entity.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

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

    const demande = await find<DemandeDélaiEntity>(
      `demande-délai|${identifiantProjetValueType.formatter()}#${demandéLe}`,
    );

    return Option.match(demande)
      .some((demande) => mapToReadModel({ identifiantProjet: identifiantProjetValueType, demande }))
      .none();
  };
  mediator.register('Lauréat.Délai.Query.ConsulterDemandeDélai', handler);
};

type MapToReadModel = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  demande: DemandeDélaiEntity;
}) => ConsulterDemandeDélaiReadModel;

const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  demande: {
    statut,
    demandéLe,
    demandéPar,
    nombreDeMois,
    raison,
    pièceJustificative,
    instruction,
    accord,
    rejet,
    autoritéCompétente,
  },
}) => {
  return {
    identifiantProjet,
    statut: Délai.StatutDemandeDélai.convertirEnValueType(statut),
    pièceJustificative: DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
      demandéLe,
      pièceJustificative.format,
    ),
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
      rejetéePar: Email.convertirEnValueType(rejet.rejetéePar),
      rejetéeLe: DateTime.convertirEnValueType(rejet.rejetéeLe),
      réponseSignée: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Délai.TypeDocumentDemandeDélai.demandeRejetée.formatter(),
        rejet.rejetéeLe,
        rejet.réponseSignée.format,
      ),
    },

    accord: accord && {
      accordéePar: Email.convertirEnValueType(accord.accordéePar),
      accordéeLe: DateTime.convertirEnValueType(accord.accordéeLe),
      nombreDeMois: accord.nombreDeMois,
      dateAchèvementPrévisionnelCalculée: DateTime.convertirEnValueType(
        accord.dateAchèvementPrévisionnelCalculée,
      ),
      réponseSignée: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
        accord.accordéeLe,
        accord.réponseSignée.format,
      ),
    },
  };
};

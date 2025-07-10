import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { StatutDemandeDélai } from '../..';
import { Délai } from '../../..';
import { DemandeDélaiEntity } from '../../délai.entity';

export type ConsulterDemandeDélaiReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  statut: StatutDemandeDélai.ValueType;

  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;

  nombreDeMois: number;

  pièceJustificative: DocumentProjet.ValueType;

  accord?: {
    accordéPar: Email.ValueType;
    accordéLe: DateTime.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    nombreDeMois: number;
  };

  rejet?: {
    rejetéPar: Email.ValueType;
    rejetéLe: DateTime.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  };
};

export type ConsulterDemandeDélaiQuery = Message<
  'Lauréat.Délai.Query.ConsulterDemandeDélai',
  {
    identifiantProjet: string;
    demandéLe: string;
  },
  Option.Type<ConsulterDemandeDélaiReadModel>
>;

export type ConsulterDemandeDélaiDependencies = {
  find: Find;
};

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
      .some((demande) =>
        mapToReadModel({
          identifiantProjet: identifiantProjetValueType,
          demande,
        }),
      )
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
  demande: { statut, demandéLe, demandéPar, nombreDeMois, pièceJustificative, accord, rejet },
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

    nombreDeMois,

    accord: accord && {
      accordéPar: Email.convertirEnValueType(accord.accordéPar),
      accordéLe: DateTime.convertirEnValueType(accord.accordéLe),
      nombreDeMois: accord.nombreDeMois,
      réponseSignée: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
        accord.accordéLe,
        accord.réponseSignée.format,
      ),
    },

    rejet: rejet && {
      motif: rejet.motif,
      rejetéPar: Email.convertirEnValueType(rejet.rejetéPar),
      rejetéLe: DateTime.convertirEnValueType(rejet.rejetéLe),
      réponseSignée: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
        rejet.rejetéLe,
        rejet.réponseSignée.format,
      ),
    },
  };
};

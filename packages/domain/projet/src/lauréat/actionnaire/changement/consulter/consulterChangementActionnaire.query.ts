import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  ChangementActionnaireEntity,
  StatutChangementActionnaire,
  TypeDocumentActionnaire,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterChangementActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    nouvelActionnaire: string;
    statut: StatutChangementActionnaire.ValueType;

    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;

    accord?: {
      réponseSignée: DocumentProjet.ValueType;
      accordéePar: Email.ValueType;
      accordéeLe: DateTime.ValueType;
    };

    rejet?: {
      réponseSignée: DocumentProjet.ValueType;
      rejetéePar: Email.ValueType;
      rejetéeLe: DateTime.ValueType;
    };
  };
};

export type ConsulterChangementActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
  {
    identifiantProjet: string;
    demandéLe: string;
  },
  Option.Type<ConsulterChangementActionnaireReadModel>
>;

export type ConsulterChangementActionnaireDependencies = {
  find: Find;
};

export const registerConsulterChangementActionnaireQuery = ({
  find,
}: ConsulterChangementActionnaireDependencies) => {
  const handler: MessageHandler<ConsulterChangementActionnaireQuery> = async ({
    identifiantProjet,
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementActionnaire = await find<ChangementActionnaireEntity>(
      `changement-actionnaire|${identifiantProjetValueType.formatter()}#${demandéLe}`,
    );

    return Option.match(demandeChangementActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterChangementActionnaire', handler);
};

export const mapToReadModel = (result: ChangementActionnaireEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    demande: {
      nouvelActionnaire: result.demande.nouvelActionnaire,
      statut: StatutChangementActionnaire.convertirEnValueType(result.demande.statut),

      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      raison: result.demande.raison,
      pièceJustificative: result.demande.pièceJustificative?.format
        ? DocumentProjet.convertirEnValueType(
            result.identifiantProjet,
            TypeDocumentActionnaire.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
            result.demande.pièceJustificative?.format,
          )
        : undefined,

      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentActionnaire.changementAccordé.formatter(),
              DateTime.convertirEnValueType(result.demande.accord.accordéeLe).formatter(),
              result.demande.accord.réponseSignée.format,
            ),
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéeLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe),
            rejetéePar: Email.convertirEnValueType(result.demande.rejet.rejetéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentActionnaire.changementRejeté.formatter(),
              DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe).formatter(),
              result.demande.rejet.réponseSignée.format,
            ),
          }
        : undefined,
    },
  } satisfies ConsulterChangementActionnaireReadModel;
};

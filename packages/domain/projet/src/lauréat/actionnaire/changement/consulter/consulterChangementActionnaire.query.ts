import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import {
  type ChangementActionnaireEntity,
  DocumentActionnaire,
  StatutChangementActionnaire,
} from '../../index.js';

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
      statut: StatutChangementActionnaire.convertirEnValueType(result.statut),

      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      pièceJustificative: result.demande.pièceJustificative?.format
        ? DocumentActionnaire.pièceJustificative({
            identifiantProjet: result.identifiantProjet,
            demandéLe: result.demande.demandéLe,
            pièceJustificative: result.demande.pièceJustificative,
          })
        : undefined,

      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéPar),
            réponseSignée: DocumentActionnaire.changementAccordé({
              identifiantProjet: result.identifiantProjet,
              accordéLe: result.demande.accord.accordéLe,
              réponseSignée: result.demande.accord.réponseSignée,
            }),
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéeLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéLe),
            rejetéePar: Email.convertirEnValueType(result.demande.rejet.rejetéPar),
            réponseSignée: DocumentActionnaire.changementRejeté({
              identifiantProjet: result.identifiantProjet,
              rejetéLe: result.demande.rejet.rejetéLe,
              réponseSignée: result.demande.rejet.réponseSignée,
            }),
          }
        : undefined,
    },
  } satisfies ConsulterChangementActionnaireReadModel;
};

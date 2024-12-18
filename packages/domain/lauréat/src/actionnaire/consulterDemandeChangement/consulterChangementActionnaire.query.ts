import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireEntity, StatutChangementActionnaire, TypeDocumentActionnaire } from '..';

export type ConsulterChangementActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  demande: {
    statut: StatutChangementActionnaire.ValueType;

    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative: DocumentProjet.ValueType;

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
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementActionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demandeChangementActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterChangementActionnaire', handler);
};

export const mapToReadModel = (result: ActionnaireEntity) => {
  if (!result.demande) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    demande: {
      statut: StatutChangementActionnaire.convertirEnValueType(result.demande.statut),

      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentActionnaire.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
        result.demande.pièceJustificative?.format,
      ),

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

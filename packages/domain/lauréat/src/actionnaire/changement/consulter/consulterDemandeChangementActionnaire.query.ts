import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireEntity, StatutChangementActionnaire, TypeDocumentActionnaire } from '../..';

export type ConsulterDemandeChangementActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: {
    actuel: string;
    demandé: string;
  };

  demande: {
    statut: StatutChangementActionnaire.ValueType;

    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    raison: string;
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

export type ConsulterDemandeChangementActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDemandeChangementActionnaireReadModel>
>;

export type ConsulterDemandeChangementActionnaireDependencies = {
  find: Find;
};

export const registerConsulterDemandeChangementActionnaireQuery = ({
  find,
}: ConsulterDemandeChangementActionnaireDependencies) => {
  const handler: MessageHandler<ConsulterDemandeChangementActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementActionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demandeChangementActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire', handler);
};

export const mapToReadModel = (result: ActionnaireEntity) => {
  if (!result.demande) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    actionnaire: {
      actuel: result.actionnaire.nom,
      demandé: result.demande.nouvelActionnaire,
    },

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
  } satisfies ConsulterDemandeChangementActionnaireReadModel;
};

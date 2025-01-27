import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireEntity, StatutChangementActionnaire, TypeDocumentActionnaire } from '../..';

export type ConsulterChangementActionnaireEnCoursReadModel = {
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
export type ConsulterChangementEnCoursActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterChangementEnCoursActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterChangementActionnaireEnCoursReadModel>
>;
export type ConsulterChangementActionnaireEnCoursDependencies = {
  find: Find;
};
export const registerConsulterChangementEnCoursActionnaireQuery = ({
  find,
}: ConsulterChangementActionnaireEnCoursDependencies) => {
  const handler: MessageHandler<ConsulterChangementEnCoursActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementActionnaire = await find<ActionnaireEntity>(
      `actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demandeChangementActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterChangementEnCoursActionnaire', handler);
};

export const mapToReadModel = (result: ActionnaireEntity) => {
  if (!result.demandeEnCours) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    actionnaire: {
      actuel: result.actionnaire.nom,
      demandé: result.demandeEnCours.nouvelActionnaire,
    },

    demande: {
      statut: StatutChangementActionnaire.convertirEnValueType(result.demandeEnCours.statut),

      demandéeLe: DateTime.convertirEnValueType(result.demandeEnCours.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demandeEnCours.demandéePar),
      raison: result.demandeEnCours.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentActionnaire.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demandeEnCours.demandéeLe).formatter(),
        result.demandeEnCours.pièceJustificative?.format,
      ),

      accord: result.demandeEnCours.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demandeEnCours.accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(result.demandeEnCours.accord.accordéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentActionnaire.changementAccordé.formatter(),
              DateTime.convertirEnValueType(result.demandeEnCours.accord.accordéeLe).formatter(),
              result.demandeEnCours.accord.réponseSignée.format,
            ),
          }
        : undefined,
      rejet: result.demandeEnCours.rejet
        ? {
            rejetéeLe: DateTime.convertirEnValueType(result.demandeEnCours.rejet.rejetéeLe),
            rejetéePar: Email.convertirEnValueType(result.demandeEnCours.rejet.rejetéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentActionnaire.changementRejeté.formatter(),
              DateTime.convertirEnValueType(result.demandeEnCours.rejet.rejetéeLe).formatter(),
              result.demandeEnCours.rejet.réponseSignée.format,
            ),
          }
        : undefined,
    },
  } satisfies ConsulterChangementActionnaireEnCoursReadModel;
};

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

    demandéPar: Email.ValueType;
    demandéLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative: DocumentProjet.ValueType;
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
      demandéLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéPar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentActionnaire.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéLe).formatter(),
        result.demande.pièceJustificative?.format,
      ),
    },

    accord: result.demande.accord
      ? {
          accordéLe: DateTime.convertirEnValueType(result.demande.accord.accordéLe),
          accordéPar: Email.convertirEnValueType(result.demande.accord.accordéPar),
          réponseSignée: DocumentProjet.convertirEnValueType(
            result.identifiantProjet,
            TypeDocumentActionnaire.modificationAccordée.formatter(),
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
            TypeDocumentActionnaire.modificationRejetée.formatter(),
            DateTime.convertirEnValueType(result.demande.rejet.rejetéLe).formatter(),
            result.demande.rejet.réponseSignée.format,
          ),
        }
      : undefined,
  } satisfies ConsulterChangementActionnaireReadModel;
};

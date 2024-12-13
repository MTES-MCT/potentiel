import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  ModificationActionnaireEntity,
  StatutModificationActionnaire,
  TypeDocumentActionnaire,
} from '..';

export type ConsulterModificationActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutModificationActionnaire.ValueType;
  demande: {
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

export type ConsulterModificationActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterModificationActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterModificationActionnaireReadModel>
>;

export type ConsulterModificationActionnaireDependencies = {
  find: Find;
};

export const registerDemanderModificationActionnaireQuery = ({
  find,
}: ConsulterModificationActionnaireDependencies) => {
  const handler: MessageHandler<ConsulterModificationActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeModificationActionnaire = await find<ModificationActionnaireEntity>(
      `modification-actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demandeModificationActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterModificationActionnaire', handler);
};

export const mapToReadModel = (result: ModificationActionnaireEntity) => {
  return {
    demande: {
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
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    statut: StatutModificationActionnaire.convertirEnValueType(result.statut),
  } satisfies ConsulterModificationActionnaireReadModel;
};

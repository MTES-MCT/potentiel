import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  DemandeModificationActionnaireEntity,
  StatutModificationActionnaire,
  TypeDocumentActionnaire,
} from '..';

export type ConsulterDemandeModificationActionnaireReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutModificationActionnaire.ValueType;
  demande: {
    demandéPar: Email.ValueType;
    demandéLe: DateTime.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
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

export type ConsulterDemandeModificationActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterDemandeModificationActionnaire',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDemandeModificationActionnaireReadModel>
>;

export type ConsulterDemandeModificationActionnaireDependencies = {
  find: Find;
};

export const registerConsulterActionnaireQuery = ({
  find,
}: ConsulterDemandeModificationActionnaireDependencies) => {
  const handler: MessageHandler<ConsulterDemandeModificationActionnaireQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeModificationActionnaire = await find<DemandeModificationActionnaireEntity>(
      `demande-modification-actionnaire|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(demandeModificationActionnaire)
      .some((demande) => mapToReadModel(demande))
      .none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterDemandeModificationActionnaire', handler);
};

const mapToReadModel = (result: DemandeModificationActionnaireEntity) => {
  return {
    demande: {
      demandéLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéPar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      pièceJustificative: result.demande.pièceJustificative
        ? DocumentProjet.convertirEnValueType(
            result.identifiantProjet,
            TypeDocumentActionnaire.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demande.demandéLe).formatter(),
            result.demande.pièceJustificative?.format,
          )
        : undefined,
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
  } satisfies ConsulterDemandeModificationActionnaireReadModel;
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import {
  IdentifiantProjet,
  DateTime,
  QueryPorts,
  DocumentProjet,
  IdentifiantUtilisateur,
} from '@potentiel-domain/common';
import { ReadModel } from '@potentiel-domain/core';

import { AbandonInconnuErreur } from '../abandonInconnu.error';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonProjection = ReadModel<
  'abandon',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    statut: StatutAbandon.RawType;

    demandeRaison: string;
    demandePièceJustificativeFormat?: string;
    demandeRecandidature: boolean;
    demandeDemandéLe: DateTime.RawType;

    accordRéponseSignéeFormat?: string;
    accordAccordéLe?: DateTime.RawType;

    rejetRéponseSignéeFormat?: string;
    rejetRejetéLe?: DateTime.RawType;

    confirmationDemandéeLe?: DateTime.RawType;
    confirmationDemandéeRéponseSignéeFormat?: string;
    confirmationConfirméLe?: DateTime.RawType;
  }
>;

export type ConsulterAbandonReadModel = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutAbandon.RawType;
  demande: {
    raison: string;
    recandidature: boolean;
    piéceJustificative?: DocumentProjet.RawType;
    demandéLe: DateTime.RawType;
    demandéPar: IdentifiantUtilisateur.RawType;
    confirmation?: {
      demandéLe: DateTime.RawType;
      demandéPar: IdentifiantUtilisateur.RawType;
      réponseSignée: DocumentProjet.RawType; // type: 'abandon-à-confirmer'
      confirméLe?: DateTime.RawType;
    };
  };
  accord?: {
    accordéLe: DateTime.RawType;
    accordéPar: IdentifiantUtilisateur.RawType;
    réponseSignée: DocumentProjet.RawType; // type: 'abandon-accordé'
  };
  rejet?: {
    rejetéLe: DateTime.RawType;
    rejetéPar: IdentifiantUtilisateur.RawType;
    réponseSignée: DocumentProjet.RawType; // type 'abandon-rejeté'
  };
  abandon?: {
    abandonnéLe?: DateTime.RawType;
    abandonnéPar: IdentifiantUtilisateur.RawType;
  };
};

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjet: string;
  },
  ConsulterAbandonReadModel
>;

export type ConsulterAbandonDependencies = {
  find: QueryPorts.Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjet }) => {
    const result = await find<AbandonProjection>(
      `abandon|${IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()}`,
    );

    if (isNone(result)) {
      throw new AbandonInconnuErreur();
    }

    return result;
  };
  mediator.register('CONSULTER_ABANDON', handler);
};

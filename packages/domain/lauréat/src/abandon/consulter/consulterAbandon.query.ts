import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime, QueryPorts } from '@potentiel-domain/common';
import { ReadModel } from '@potentiel-domain/core';

import { AbandonInconnuErreur } from '../abandonInconnu.error';
import * as Abandon from '../abandon.valueType';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonReadModel = ReadModel<
  'abandon',
  {
    identifiantDemande: Abandon.RawType;
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

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjet: string;
  },
  AbandonReadModel
>;

export type ConsulterAbandonDependencies = {
  find: QueryPorts.Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjet }) => {
    const result = await find<AbandonReadModel>(
      `abandon|${IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()}`,
    );

    if (isNone(result)) {
      throw new AbandonInconnuErreur();
    }

    return result;
  };
  mediator.register('CONSULTER_ABANDON', handler);
};

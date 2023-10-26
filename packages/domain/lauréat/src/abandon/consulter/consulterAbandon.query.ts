import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { AbandonInconnuErreur } from '../abandonInconnu.error';
import * as StatutAbandon from '../statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';
import { AbandonProjection } from '../abandon.projection';
import { Find } from '@potentiel-libraries/projection';

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
      réponseSignée: DocumentProjet.RawType;
      confirméLe?: DateTime.RawType;
    };
  };
  accord?: {
    accordéLe: DateTime.RawType;
    accordéPar: IdentifiantUtilisateur.RawType;
    réponseSignée: DocumentProjet.RawType;
  };
  rejet?: {
    rejetéLe: DateTime.RawType;
    rejetéPar: IdentifiantUtilisateur.RawType;
    réponseSignée: DocumentProjet.RawType;
  };
};

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON',
  {
    identifiantProjetValue: string;
  },
  ConsulterAbandonReadModel
>;

export type ConsulterAbandonDependencies = {
  find: Find;
};

export const registerConsulterAbandonQuery = ({ find }: ConsulterAbandonDependencies) => {
  const handler: MessageHandler<ConsulterAbandonQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet =
      IdentifiantProjet.convertirEnValueType(identifiantProjetValue).formatter();
    const result = await find<AbandonProjection>(`abandon|${identifiantProjet}`);

    if (isNone(result)) {
      throw new AbandonInconnuErreur();
    }

    const demande: ConsulterAbandonReadModel['demande'] = {
      demandéLe: result.demandeDemandéLe,
      demandéPar: result.demandeDemandéPar,
      raison: result.demandeRaison,
      recandidature: result.demandeRecandidature,
      piéceJustificative: result.demandePièceJustificative,
      confirmation: result.confirmationDemandéeLe
        ? {
            demandéLe: result.confirmationDemandéeLe!,
            demandéPar: result.confirmationDemandéePar!,
            réponseSignée: result.confirmationDemandéeRéponseSignée!,
            confirméLe: result.confirmationConfirméLe,
          }
        : undefined,
    };

    const accord: ConsulterAbandonReadModel['accord'] = result.accordAccordéLe
      ? {
          accordéLe: result.accordAccordéLe!,
          accordéPar: result.accordAccordéPar!,
          réponseSignée: result.accordRéponseSignée!,
        }
      : undefined;

    const rejet: ConsulterAbandonReadModel['rejet'] = result.rejetRejetéLe
      ? {
          rejetéLe: result.rejetRejetéLe!,
          rejetéPar: result.rejetRejetéPar!,
          réponseSignée: result.rejetRéponseSignée!,
        }
      : undefined;

    return {
      demande,
      identifiantProjet,
      statut: result.statut,
      accord,
      rejet,
    };
  };
  mediator.register('CONSULTER_ABANDON', handler);
};

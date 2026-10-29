import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import {
  AutoritéCompétente,
  type ChangementPuissanceEntity,
  DocumentPuissance,
  StatutChangementPuissance,
} from '../../index.js';

export type ConsulterChangementPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  autoritéCompétente?: AutoritéCompétente.ValueType;
  demande: {
    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    nouvellePuissance: number;
    nouvellePuissanceDeSite?: number;
    statut: StatutChangementPuissance.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
    accord?: {
      réponseSignée?: DocumentProjet.ValueType;
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

export type ConsulterChangementPuissanceQuery = Message<
  'Lauréat.Puissance.Query.ConsulterChangementPuissance',
  {
    identifiantProjet: string;
    demandéLe: string;
  },
  Option.Type<ConsulterChangementPuissanceReadModel>
>;

export type ConsulterChangementPuissanceDependencies = {
  find: Find;
};

export const registerConsulterChangementPuissanceQuery = ({
  find,
}: ConsulterChangementPuissanceDependencies) => {
  const handler: MessageHandler<ConsulterChangementPuissanceQuery> = async ({
    identifiantProjet,
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementPuissance = await find<ChangementPuissanceEntity>(
      `changement-puissance|${identifiantProjetValueType.formatter()}#${demandéLe}`,
    );

    return Option.match(demandeChangementPuissance).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Puissance.Query.ConsulterChangementPuissance', handler);
};

export const mapToReadModel = (result: ChangementPuissanceEntity) => {
  if (!result) {
    return Option.none;
  }

  const statut = StatutChangementPuissance.convertirEnValueType(result.statut);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    autoritéCompétente: result.autoritéCompétente
      ? AutoritéCompétente.convertirEnValueType(result.autoritéCompétente)
      : undefined,

    demande: {
      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéPar),
      nouvellePuissance: result.demande.nouvellePuissance,
      nouvellePuissanceDeSite: result.demande.nouvellePuissanceDeSite,
      statut,
      raison: result.demande.raison,
      pièceJustificative: result.demande.pièceJustificative
        ? DocumentPuissance.pièceJustificative({
            identifiantProjet: result.identifiantProjet,
            demandéLe: result.demande.demandéLe,
            pièceJustificative: result.demande.pièceJustificative,
          })
        : undefined,
      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéPar),
            réponseSignée: result.demande.accord.réponseSignée
              ? DocumentPuissance.changementAccordé({
                  identifiantProjet: result.identifiantProjet,
                  accordéLe: result.demande.accord.accordéLe,
                  réponseSignée: result.demande.accord.réponseSignée,
                })
              : undefined,
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéeLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéLe),
            rejetéePar: Email.convertirEnValueType(result.demande.rejet.rejetéPar),
            réponseSignée: DocumentPuissance.changementRejeté({
              identifiantProjet: result.identifiantProjet,
              rejetéLe: result.demande.rejet.rejetéLe,
              réponseSignée: result.demande.rejet.réponseSignée,
            }),
          }
        : undefined,
    },
  } satisfies ConsulterChangementPuissanceReadModel;
};

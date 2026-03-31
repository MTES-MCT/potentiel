import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  ChangementPuissanceEntity,
  StatutChangementPuissance,
  DocumentPuissance,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ConsulterChangementPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

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

  const statut = StatutChangementPuissance.convertirEnValueType(result.demande.statut);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    demande: {
      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      nouvellePuissance: result.demande.nouvellePuissance,
      nouvellePuissanceDeSite: result.demande.nouvellePuissanceDeSite,
      statut,
      raison: result.demande.raison,
      pièceJustificative: result.demande.pièceJustificative
        ? DocumentPuissance.pièceJustificative({
            identifiantProjet: result.identifiantProjet,
            demandéLe: result.demande.demandéeLe,
            pièceJustificative: result.demande.pièceJustificative,
          })
        : undefined,
      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéePar),
            réponseSignée: result.demande.accord.réponseSignée
              ? DocumentPuissance.changementAccordé({
                  identifiantProjet: result.identifiantProjet,
                  accordéLe: result.demande.accord.accordéeLe,
                  réponseSignée: result.demande.accord.réponseSignée,
                })
              : undefined,
          }
        : undefined,
      rejet: result.demande.rejet
        ? {
            rejetéeLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe),
            rejetéePar: Email.convertirEnValueType(result.demande.rejet.rejetéePar),
            réponseSignée: DocumentPuissance.changementRejeté({
              identifiantProjet: result.identifiantProjet,
              rejetéLe: result.demande.rejet.rejetéeLe,
              réponseSignée: result.demande.rejet.réponseSignée,
            }),
          }
        : undefined,
    },
  } satisfies ConsulterChangementPuissanceReadModel;
};

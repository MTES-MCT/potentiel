import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  ChangementPuissanceEntity,
  RatioChangementPuissance,
  StatutChangementPuissance,
  TypeDocumentPuissance,
} from '../..';

export type ConsulterChangementPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    nouvellePuissance: number;
    statut: StatutChangementPuissance.ValueType;
    autoritéCompétente?: RatioChangementPuissance.AutoritéCompétente;
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
      statut,
      raison: result.demande.raison,
      autoritéCompétente: result.demande.autoritéCompétente,
      pièceJustificative: result.demande.pièceJustificative
        ? DocumentProjet.convertirEnValueType(
            result.identifiantProjet,
            TypeDocumentPuissance.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
            result.demande.pièceJustificative?.format,
          )
        : undefined,
      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentPuissance.changementAccordé.formatter(),
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
              TypeDocumentPuissance.changementRejeté.formatter(),
              DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe).formatter(),
              result.demande.rejet.réponseSignée.format,
            ),
<<<<<<< HEAD
          }
        : undefined,
    },
=======
            accord: result.demande.accord
              ? {
                  accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéeLe),
                  accordéePar: Email.convertirEnValueType(result.demande.accord.accordéePar),
                  réponseSignée: result.demande.accord.réponseSignée
                    ? DocumentProjet.convertirEnValueType(
                        result.identifiantProjet,
                        TypeDocumentPuissance.changementAccordé.formatter(),
                        DateTime.convertirEnValueType(result.demande.accord.accordéeLe).formatter(),
                        result.demande.accord.réponseSignée.format,
                      )
                    : undefined,
                }
              : undefined,
            rejet: result.demande.rejet
              ? {
                  rejetéeLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe),
                  rejetéePar: Email.convertirEnValueType(result.demande.rejet.rejetéePar),
                  réponseSignée: DocumentProjet.convertirEnValueType(
                    result.identifiantProjet,
                    TypeDocumentPuissance.changementRejeté.formatter(),
                    DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe).formatter(),
                    result.demande.rejet.réponseSignée.format,
                  ),
                }
              : undefined,
          },
>>>>>>> 🎨 V1
  } satisfies ConsulterChangementPuissanceReadModel;
};

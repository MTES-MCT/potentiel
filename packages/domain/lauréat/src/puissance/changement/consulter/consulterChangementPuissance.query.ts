import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  ChangementPuissanceEntity,
  RatioChangementPuissance,
  StatutChangementPuissance,
  TypeDocumentPuissance,
} from '../..';

export type ConsulterChangementPuissanceReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  demande: {
    nouvellePuissance: number;
    statut: StatutChangementPuissance.ValueType;
    autoritéCompétente: RatioChangementPuissance.AutoritéCompétente;

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

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    demande: {
      nouvellePuissance: result.demande.nouvellePuissance,
      statut: StatutChangementPuissance.convertirEnValueType(result.demande.statut),
      autoritéCompétente: result.demande.autoritéCompétente,
      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentPuissance.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
        result.demande.pièceJustificative?.format,
      ),
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
          }
        : undefined,
    },
  } satisfies ConsulterChangementPuissanceReadModel;
};

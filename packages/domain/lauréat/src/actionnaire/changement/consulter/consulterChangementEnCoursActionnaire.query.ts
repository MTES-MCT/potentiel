import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Find, Where } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import {
  ChangementActionnaireEntity,
  ConsulterChangementActionnaireReadModel,
  StatutChangementActionnaire,
  TypeDocumentActionnaire,
} from '../..';

export type ConsulterChangementActionnaireEnCoursReadModel = Omit<
  ConsulterChangementActionnaireReadModel,
  'demande'
> & {
  demande: Omit<ConsulterChangementActionnaireReadModel['demande'], 'pièceJustificative'> & {
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementEnCoursActionnaireQuery = Message<
  'Lauréat.Actionnaire.Query.ConsulterChangementEnCoursActionnaire',
  {
    identifiantProjet: string;
    demandéLe: string;
  },
  Option.Type<ConsulterChangementActionnaireEnCoursReadModel>
>;
export type ConsulterChangementActionnaireEnCoursDependencies = {
  find: Find;
};
export const registerConsulterChangementEnCoursActionnaireQuery = ({
  find,
}: ConsulterChangementActionnaireEnCoursDependencies) => {
  const handler: MessageHandler<ConsulterChangementEnCoursActionnaireQuery> = async ({
    identifiantProjet,
    demandéLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementActionnaire = await find<ChangementActionnaireEntity>(
      `changement-actionnaire|${identifiantProjetValueType.formatter()}#${demandéLe}`,
      {
        where: {
          demande: {
            statut: Where.equal(StatutChangementActionnaire.demandé.statut),
          },
        },
      },
    );

    return Option.match(demandeChangementActionnaire).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Actionnaire.Query.ConsulterChangementEnCoursActionnaire', handler);
};

export const mapToReadModel = (result: ChangementActionnaireEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    demande: {
      statut: StatutChangementActionnaire.convertirEnValueType(result.demande.statut),
      nouvelActionnaire: result.demande.nouvelActionnaire,
      demandéeLe: DateTime.convertirEnValueType(result.demande.demandéeLe),
      demandéePar: Email.convertirEnValueType(result.demande.demandéePar),
      raison: result.demande.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentActionnaire.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.demande.demandéeLe).formatter(),
        result.demande.pièceJustificative!.format,
      ),
      accord: result.demande.accord
        ? {
            accordéeLe: DateTime.convertirEnValueType(result.demande.accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(result.demande.accord.accordéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              result.identifiantProjet,
              TypeDocumentActionnaire.changementAccordé.formatter(),
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
              TypeDocumentActionnaire.changementRejeté.formatter(),
              DateTime.convertirEnValueType(result.demande.rejet.rejetéeLe).formatter(),
              result.demande.rejet.réponseSignée.format,
            ),
          }
        : undefined,
    },
  } satisfies ConsulterChangementActionnaireEnCoursReadModel;
};

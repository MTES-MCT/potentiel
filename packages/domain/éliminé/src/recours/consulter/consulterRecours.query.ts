import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AucunRecoursEnCours } from '../aucunRecoursEnCours.error';
import * as StatutRecours from '../statutRecours.valueType';
import { DocumentProjet } from '@potentiel-domain/document';
import { RecoursEntity } from '../recours.entity';
import { Find } from '@potentiel-domain/core';
import * as TypeDocumentRecours from '../typeDocumentRecours.valueType';

export type ConsulterRecoursReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutRecours.ValueType;
  demande: {
    raison: string;
    piéceJustificative?: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
  };
  accord?: {
    accordéLe: DateTime.ValueType;
    accordéPar: IdentifiantUtilisateur.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  };
  rejet?: {
    rejetéLe: DateTime.ValueType;
    rejetéPar: IdentifiantUtilisateur.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  };
};

export type ConsulterRecoursQuery = Message<
  'CONSULTER_RECOURS_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterRecoursReadModel
>;

export type ConsulterRecoursDependencies = {
  find: Find;
};

export const registerConsulterRecoursQuery = ({ find }: ConsulterRecoursDependencies) => {
  const handler: MessageHandler<ConsulterRecoursQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<RecoursEntity>(`recours|${identifiantProjet.formatter()}`);

    if (isNone(result)) {
      throw new AucunRecoursEnCours();
    }

    const demande: ConsulterRecoursReadModel['demande'] = {
      demandéLe: DateTime.convertirEnValueType(result.demandeDemandéLe),
      demandéPar: IdentifiantUtilisateur.convertirEnValueType(result.demandeDemandéPar),
      raison: result.demandeRaison,
      piéceJustificative: result.demandePièceJustificativeFormat
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRecours.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demandeDemandéLe).formatter(),
            result.demandePièceJustificativeFormat,
          )
        : undefined,
    };

    const accord: ConsulterRecoursReadModel['accord'] = result.accordAccordéLe
      ? {
          accordéLe: DateTime.convertirEnValueType(result.accordAccordéLe!),
          accordéPar: IdentifiantUtilisateur.convertirEnValueType(result.accordAccordéPar!),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRecours.recoursAccordé.formatter(),
            DateTime.convertirEnValueType(result.accordAccordéLe!).formatter(),
            result.accordRéponseSignéeFormat!,
          ),
        }
      : undefined;

    const rejet: ConsulterRecoursReadModel['rejet'] = result.rejetRejetéLe
      ? {
          rejetéLe: DateTime.convertirEnValueType(result.rejetRejetéLe!),
          rejetéPar: IdentifiantUtilisateur.convertirEnValueType(result.rejetRejetéPar!),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentRecours.recoursRejeté.formatter(),
            DateTime.convertirEnValueType(result.rejetRejetéLe!).formatter(),
            result.rejetRéponseSignéeFormat!,
          ),
        }
      : undefined;

    return {
      demande,
      identifiantProjet,
      statut: StatutRecours.convertirEnValueType(result.statut),
      accord,
      rejet,
    };
  };
  mediator.register('CONSULTER_RECOURS_QUERY', handler);
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AucunAbandonEnCours } from '../aucunAbandonEnCours.error';
import * as StatutAbandon from '../statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';
import { AbandonProjection } from '../abandon.projection';
import { Find } from '@potentiel-libraries/projection';
import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';
import { StatutPreuveRecandidature } from '..';

export type ConsulterAbandonReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutAbandon.ValueType;
  demande: {
    raison: string;
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;
    preuveRecandidatureDemandéeLe?: DateTime.ValueType;
    preuveRecandidatureStatut: StatutPreuveRecandidature.ValueType;
    preuveRecandidatureTransmiseLe?: DateTime.ValueType;
    preuveRecandidatureTransmisePar?: IdentifiantUtilisateur.ValueType;
    piéceJustificative?: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: IdentifiantUtilisateur.ValueType;
    confirmation?: {
      demandéLe: DateTime.ValueType;
      demandéPar: IdentifiantUtilisateur.ValueType;
      réponseSignée: DocumentProjet.ValueType;
      confirméLe?: DateTime.ValueType;
      confirméPar?: IdentifiantUtilisateur.ValueType;
    };
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

export type ConsulterAbandonQuery = Message<
  'CONSULTER_ABANDON_QUERY',
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
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<AbandonProjection>(`abandon|${identifiantProjet.formatter()}`);

    if (isNone(result)) {
      throw new AucunAbandonEnCours();
    }

    const demande: ConsulterAbandonReadModel['demande'] = {
      demandéLe: DateTime.convertirEnValueType(result.demandeDemandéLe),
      demandéPar: IdentifiantUtilisateur.convertirEnValueType(result.demandeDemandéPar),
      raison: result.demandeRaison,
      recandidature: result.demandeRecandidature,
      preuveRecandidature: result.preuveRecandidature
        ? IdentifiantProjet.convertirEnValueType(result.preuveRecandidature)
        : undefined,
      preuveRecandidatureDemandéeLe: result.preuveRecandidatureDemandéeLe
        ? DateTime.convertirEnValueType(result.preuveRecandidatureDemandéeLe)
        : undefined,
      preuveRecandidatureStatut: StatutPreuveRecandidature.convertirEnValueType(
        result.preuveRecandidatureStatut,
      ),
      piéceJustificative: result.demandePièceJustificativeFormat
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demandeDemandéLe).formatter(),
            result.demandePièceJustificativeFormat,
          )
        : undefined,
      confirmation: result.confirmationDemandéeLe
        ? {
            demandéLe: DateTime.convertirEnValueType(result.confirmationDemandéeLe!),
            demandéPar: IdentifiantUtilisateur.convertirEnValueType(
              result.confirmationDemandéePar!,
            ),
            réponseSignée: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              TypeDocumentAbandon.abandonÀConfirmer.formatter(),
              DateTime.convertirEnValueType(result.confirmationDemandéeLe!).formatter(),
              result.confirmationDemandéeRéponseSignéeFormat!,
            ),
            confirméLe: result.confirmationConfirméLe
              ? DateTime.convertirEnValueType(result.confirmationConfirméLe)
              : undefined,
            confirméPar: result.confirmationConfirméPar
              ? IdentifiantUtilisateur.convertirEnValueType(result.confirmationConfirméPar)
              : undefined,
          }
        : undefined,
    };

    const accord: ConsulterAbandonReadModel['accord'] = result.accordAccordéLe
      ? {
          accordéLe: DateTime.convertirEnValueType(result.accordAccordéLe!),
          accordéPar: IdentifiantUtilisateur.convertirEnValueType(result.accordAccordéPar!),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.abandonAccordé.formatter(),
            DateTime.convertirEnValueType(result.accordAccordéLe!).formatter(),
            result.accordRéponseSignéeFormat!,
          ),
        }
      : undefined;

    const rejet: ConsulterAbandonReadModel['rejet'] = result.rejetRejetéLe
      ? {
          rejetéLe: DateTime.convertirEnValueType(result.rejetRejetéLe!),
          rejetéPar: IdentifiantUtilisateur.convertirEnValueType(result.rejetRejetéPar!),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.abandonRejeté.formatter(),
            DateTime.convertirEnValueType(result.rejetRejetéLe!).formatter(),
            result.rejetRéponseSignéeFormat!,
          ),
        }
      : undefined;

    return {
      demande,
      identifiantProjet,
      statut: StatutAbandon.convertirEnValueType(result.statut),
      accord,
      rejet,
    };
  };
  mediator.register('CONSULTER_ABANDON_QUERY', handler);
};

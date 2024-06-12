import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AucunAbandonEnCours } from '../aucunAbandonEnCours.error';
import * as StatutAbandon from '../statutAbandon.valueType';
import { DocumentProjet } from '@potentiel-domain/document';
import { AbandonEntity } from '../abandon.entity';
import { Find } from '@potentiel-domain/core';
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
  'Lauréat.Abandon.Query.ConsulterAbandon',
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
    const result = await find<AbandonEntity>(`abandon|${identifiantProjet.formatter()}`);

    if (Option.isNone(result)) {
      throw new AucunAbandonEnCours();
    }

    const demande: ConsulterAbandonReadModel['demande'] = {
      demandéLe: DateTime.convertirEnValueType(result.demande.demandéLe),
      demandéPar: Email.convertirEnValueType(result.demande.demandéPar),
      raison: result.demande.raison,
      recandidature: !!result.demande.recandidature,
      preuveRecandidature: result.demande.recandidature?.preuve?.identifiantProjet
        ? IdentifiantProjet.convertirEnValueType(
            result.demande.recandidature.preuve.identifiantProjet,
          )
        : undefined,
      preuveRecandidatureTransmiseLe: result.demande.recandidature?.preuve?.transmiseLe
        ? DateTime.convertirEnValueType(result.demande.recandidature?.preuve?.transmiseLe)
        : undefined,
      preuveRecandidatureTransmisePar: result.demande.recandidature?.preuve?.transmisePar
        ? Email.convertirEnValueType(result.demande.recandidature?.preuve?.transmisePar)
        : undefined,
      preuveRecandidatureDemandéeLe: result.demande.recandidature?.preuve?.demandéeLe
        ? DateTime.convertirEnValueType(result.demande.recandidature?.preuve?.demandéeLe)
        : undefined,
      preuveRecandidatureStatut: result.demande.recandidature?.statut
        ? StatutPreuveRecandidature.convertirEnValueType(result.demande.recandidature.statut)
        : StatutPreuveRecandidature.nonApplicable,
      piéceJustificative: result.demande.pièceJustificative?.format
        ? DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.pièceJustificative.formatter(),
            DateTime.convertirEnValueType(result.demande.demandéLe).formatter(),
            result.demande.pièceJustificative?.format,
          )
        : undefined,
      confirmation: result.demande.confirmation
        ? {
            demandéLe: DateTime.convertirEnValueType(result.demande.confirmation.demandéeLe),
            demandéPar: Email.convertirEnValueType(result.demande.confirmation.demandéePar),
            réponseSignée: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              TypeDocumentAbandon.abandonÀConfirmer.formatter(),
              DateTime.convertirEnValueType(result.demande.confirmation.demandéeLe).formatter(),
              result.demande.confirmation.réponseSignée.format,
            ),
            confirméLe: result.demande.confirmation.confirméLe
              ? DateTime.convertirEnValueType(result.demande.confirmation.confirméLe)
              : undefined,
            confirméPar: result.demande.confirmation.confirméPar
              ? Email.convertirEnValueType(result.demande.confirmation.confirméPar)
              : undefined,
          }
        : undefined,
    };

    const accord: ConsulterAbandonReadModel['accord'] = result.demande.accord
      ? {
          accordéLe: DateTime.convertirEnValueType(result.demande.accord.accordéLe),
          accordéPar: Email.convertirEnValueType(result.demande.accord.accordéPar),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.abandonAccordé.formatter(),
            DateTime.convertirEnValueType(result.demande.accord.accordéLe).formatter(),
            result.demande.accord.réponseSignée.format,
          ),
        }
      : undefined;

    const rejet: ConsulterAbandonReadModel['rejet'] = result.demande.rejet
      ? {
          rejetéLe: DateTime.convertirEnValueType(result.demande.rejet.rejetéLe),
          rejetéPar: Email.convertirEnValueType(result.demande.rejet.rejetéPar),
          réponseSignée: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            TypeDocumentAbandon.abandonRejeté.formatter(),
            DateTime.convertirEnValueType(result.demande.rejet.rejetéLe).formatter(),
            result.demande.rejet.réponseSignée.format,
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
  mediator.register('Lauréat.Abandon.Query.ConsulterAbandon', handler);
};

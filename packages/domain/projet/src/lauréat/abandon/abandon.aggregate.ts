import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { IdentifiantProjet } from '../..';

import { StatutAbandon, TypeDocumentAbandon } from '.';

import { AbandonEvent } from './abandon.event';
import { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';
import { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';
import { DemanderOptions } from './demander/demanderAbandon.option';
import { PièceJustificativeObligatoireError } from './abandon.error';

export class AbandonAggregate extends AbstractAggregate<AbandonEvent> {
  #lauréat!: LauréatAggregate;
  #statut: StatutAbandon.ValueType = StatutAbandon.inconnu;
  #demande?: {
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    preuveRecandidature?: IdentifiantProjet.ValueType;
    preuveRecandidatureDemandéeLe?: DateTime.ValueType;
    preuveRecandidatureTransmiseLe?: DateTime.ValueType;
    preuveRecandidatureTransmisePar?: Email.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
    instruction?: {
      démarréLe: DateTime.ValueType;
      instruitPar: Email.ValueType;
    };
    confirmation?: {
      réponseSignée: {
        format: string;
      };
      demandéLe: DateTime.ValueType;
      confirméLe?: DateTime.ValueType;
    };
  };
  #rejet?: {
    rejetéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  #accord?: {
    accordéLe: DateTime.ValueType;
    réponseSignée: {
      format: string;
    };
  };
  #annuléLe?: DateTime.ValueType;
  get statut() {
    return this.#statut;
  }

  get lauréat() {
    return this.#lauréat;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  async demander({
    identifiantUtilisateur,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.lauréat.vérifierNonAchevé();
    this.lauréat.vérifierQueLeCahierDesChargesPermetUnChangement();

    this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.demandé);

    if (!pièceJustificative) {
      throw new PièceJustificativeObligatoireError();
    }

    const event: AbandonDemandéEvent = {
      type: 'AbandonDemandé-V2',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        pièceJustificative: pièceJustificative && {
          format: pièceJustificative.format,
        },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: AbandonEvent): void {
    match(event)
      .with({ type: 'AbandonDemandé-V1' }, this.applyAbandonDemandéV1.bind(this))
      .with({ type: 'AbandonDemandé-V2' }, this.applyAbandonDemandéV2.bind(this))
      .with({ type: 'AbandonAccordé-V1' }, this.applyAbandonAccordéV1.bind(this))
      .with({ type: 'AbandonRejeté-V1' }, this.applyAbandonRejetéV1.bind(this))
      .with({ type: 'AbandonAnnulé-V1' }, this.applyAbandonAnnuléV1.bind(this))
      .exhaustive();
  }

  private applyAbandonDemandéV1({
    payload: {
      identifiantProjet,
      demandéLe,
      demandéPar,
      raison,
      pièceJustificative,
      recandidature,
    },
  }: AbandonDemandéEventV1) {
    this.#statut = StatutAbandon.demandé;
    this.#demande = {
      recandidature,
      pièceJustificative:
        pièceJustificative &&
        DocumentProjet.convertirEnValueType(
          identifiantProjet,
          TypeDocumentAbandon.pièceJustificative.formatter(),
          demandéLe,
          pièceJustificative?.format,
        ),
      raison,
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      demandéPar: Email.convertirEnValueType(demandéPar),
    };
    this.#rejet = undefined;
    this.#accord = undefined;
    this.#annuléLe = undefined;
  }

  private applyAbandonDemandéV2({
    payload: { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative },
  }: AbandonDemandéEvent) {
    this.#statut = StatutAbandon.demandé;
    this.#demande = {
      recandidature: false,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentAbandon.pièceJustificative.formatter(),
        demandéLe,
        pièceJustificative?.format,
      ),
      raison,
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      demandéPar: Email.convertirEnValueType(demandéPar),
    };
    this.#rejet = undefined;
    this.#accord = undefined;
    this.#annuléLe = undefined;
  }

  private applyAbandonAccordéV1(_event: AbandonAccordéEvent) {
    this.#statut = StatutAbandon.accordé;
  }

  private applyAbandonRejetéV1(_event: AbandonRejetéEvent) {
    this.#statut = StatutAbandon.rejeté;
  }

  private applyAbandonAnnuléV1(_event: AbandonAnnuléEvent) {
    this.#statut = StatutAbandon.annulé;
  }
}

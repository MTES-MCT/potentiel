import { match, P } from 'ts-pattern';

import { Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';

import { GarantiesFinancières } from '../../lauréat/index.js';
import type { ÉliminéAggregate } from '../éliminé.aggregate.js';
import type {
  RecoursAccordéEvent,
  RecoursAccordéV1Event,
} from './accorder/recoursAccordé.event.js';
import type { AccorderOptions } from './accorder/recoursAccordé.options.js';
import type { RecoursAnnuléEvent } from './annuler/annulerRecours.event.js';
import type { AnnulerOptions } from './annuler/annulerRecours.options.js';
import type { RecoursDemandéEvent } from './demander/demanderRecours.event.js';
import type { DemanderOptions } from './demander/demanderRecours.options.js';
import type { RecoursPasséEnInstructionEvent } from './instruire/passerRecoursEnInstruction.event.js';
import type { InstruireOptions } from './instruire/passerRecoursEnInstruction.options.js';
import {
  AucunRecoursEnCours,
  DateRecoursAvantDateNotificationError,
  DateRecoursDansLeFuturError,
  RecoursDéjàEnInstructionAvecLeMêmeUtilisateurDgecError,
  ÉliminéInexistantError,
} from './recours.error.js';
import type { RecoursEvent } from './recours.event.js';
import type { RecoursRejetéEvent } from './rejeter/rejeterRecours.event.js';
import type { RejeterOptions } from './rejeter/rejeterRecours.options.js';
import * as StatutRecours from './statutRecours.valueType.js';

export class RecoursAggregate extends AbstractAggregate<RecoursEvent, 'recours', ÉliminéAggregate> {
  #statut: StatutRecours.ValueType = StatutRecours.inconnu;

  instruction?: {
    instruitPar: Email.ValueType;
  };

  get éliminé() {
    return this.parent;
  }

  async accorder({
    dateRéponseSignée,
    accordéLe,
    identifiantUtilisateur,
    réponseSignée,
  }: AccorderOptions) {
    this.vérifierQueDemandeRecoursExiste();

    if (dateRéponseSignée.estDansLeFutur()) {
      throw new DateRecoursDansLeFuturError();
    }

    if (dateRéponseSignée.estAntérieurÀ(this.éliminé.notifiéLe)) {
      throw new DateRecoursAvantDateNotificationError();
    }

    this.#statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.accordé);

    const event: RecoursAccordéEvent = {
      type: 'RecoursAccordé-V2',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        dateRéponseSignée: dateRéponseSignée.formatter(),
        accordéLe: accordéLe.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    await this.éliminé.projet.lauréat.notifier({
      attestation: { format: réponseSignée.format },
      notifiéLe: dateRéponseSignée,
      notifiéPar: identifiantUtilisateur,
    });

    if (this.éliminé.projet.cahierDesChargesActuel.estSoumisAuxGarantiesFinancières()) {
      await this.éliminé.projet.lauréat.garantiesFinancières.demander({
        demandéLe: accordéLe,
        motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.recoursAccordé,
        dateLimiteSoumission: dateRéponseSignée.ajouterNombreDeMois(2),
      });
    }

    await this.éliminé.archiver({
      dateArchive: accordéLe,
      identifiantUtilisateur,
    });
  }

  async annuler({ dateAnnulation, identifiantUtilisateur }: AnnulerOptions) {
    this.vérifierQueDemandeRecoursExiste();

    this.#statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.annulé);

    const event: RecoursAnnuléEvent = {
      type: 'RecoursAnnulé-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async demander({
    identifiantUtilisateur,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderOptions) {
    if (!this.éliminé.exists) {
      throw new ÉliminéInexistantError();
    }
    this.#statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.demandé);
    this.éliminé.projet.cahierDesChargesActuel.vérifierQueLeChangementEstPossible(
      'demande',
      'recours',
    );

    const event: RecoursDemandéEvent = {
      type: 'RecoursDemandé-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        pièceJustificative: {
          format: pièceJustificative.format,
        },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async rejeter({ identifiantUtilisateur, dateRejet, réponseSignée }: RejeterOptions) {
    this.vérifierQueDemandeRecoursExiste();

    this.#statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.rejeté);

    const event: RecoursRejetéEvent = {
      type: 'RecoursRejeté-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        rejetéLe: dateRejet.formatter(),
        rejetéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async passerEnInstruction({ dateInstruction, identifiantUtilisateur }: InstruireOptions) {
    this.vérifierQueDemandeRecoursExiste();

    this.#statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutRecours.enInstruction);

    if (this.instruction?.instruitPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new RecoursDéjàEnInstructionAvecLeMêmeUtilisateurDgecError();
    }

    const event: RecoursPasséEnInstructionEvent = {
      type: 'RecoursPasséEnInstruction-V1',
      payload: {
        identifiantProjet: this.éliminé.projet.identifiantProjet.formatter(),
        passéEnInstructionLe: dateInstruction.formatter(),
        passéEnInstructionPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: RecoursEvent): void {
    match(event)
      .with(
        {
          type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2'),
        },
        (event) => this.applyRecoursAccordé(event),
      )
      .with(
        {
          type: 'RecoursAnnulé-V1',
        },
        (event) => this.applyRecoursAnnuléV1(event),
      )
      .with(
        {
          type: 'RecoursDemandé-V1',
        },
        (event) => this.applyRecoursDemandéV1(event),
      )
      .with(
        {
          type: 'RecoursRejeté-V1',
        },
        (event) => this.applyRecoursRejetéV1(event),
      )
      .with(
        {
          type: 'RecoursPasséEnInstruction-V1',
        },
        (event) => this.applyRecoursPasséEnInstructionV1(event),
      )
      .exhaustive();
  }

  private applyRecoursAccordé(_: RecoursAccordéV1Event | RecoursAccordéEvent) {
    this.#statut = StatutRecours.accordé;
    this.instruction = undefined;
  }

  private applyRecoursAnnuléV1(_: RecoursAnnuléEvent) {
    this.#statut = StatutRecours.annulé;
    this.instruction = undefined;
  }

  private applyRecoursDemandéV1(_: RecoursDemandéEvent) {
    this.#statut = StatutRecours.demandé;
  }

  private applyRecoursRejetéV1(_: RecoursRejetéEvent) {
    this.#statut = StatutRecours.rejeté;
    this.instruction = undefined;
  }

  private applyRecoursPasséEnInstructionV1({
    payload: { passéEnInstructionPar },
  }: RecoursPasséEnInstructionEvent) {
    this.#statut = StatutRecours.enInstruction;
    this.instruction = {
      instruitPar: Email.convertirEnValueType(passéEnInstructionPar),
    };
  }

  private vérifierQueDemandeRecoursExiste() {
    if (!this.exists) {
      throw new AucunRecoursEnCours();
    }
  }
}

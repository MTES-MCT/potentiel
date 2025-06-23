import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { LauréatAggregate } from '../lauréat.aggregate';

import { TypeDocumentChangementReprésentantLégal, TypeReprésentantLégal } from '.';

import * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';
import type {
  ReprésentantLégalImportéEvent,
  ReprésentantLégalModifiéEvent,
  ChangementReprésentantLégalDemandéEvent,
  ChangementReprésentantLégalCorrigéEvent,
  ChangementReprésentantLégalAccordéEvent,
  ChangementReprésentantLégalRejetéEvent,
  ChangementReprésentantLégalAnnuléEvent,
  ChangementReprésentantLégalSuppriméEvent,
} from './représentantLégal.event';
import type { ImporterOptions } from './importer/importerReprésentantLégal.options';
import type { ModifierOptions } from './modifier/modifierReprésentantLégal.options';
import type { DemanderChangementOptions } from './changement/demander/demanderChangementReprésentantLégal.options';
import type { CorrigerChangementOptions } from './changement/corriger/corrigerChangementReprésentantLégal.options';
import type { AccorderOptions } from './changement/accorder/accorderChangementReprésentantLégal.options';
import type { RejeterOptions } from './changement/rejeter/rejeterChangementReprésentantLégal.options';
import type { AnnulerOptions } from './changement/annuler/annulerChangementReprésentantLégal.options';
import type { SupprimerOptions } from './changement/supprimer/supprimerChangementReprésentantLégal.options';
import {
  DemandeDeChangementEnCoursError,
  ReprésentantLégalDéjàImportéError,
  ReprésentantLégalIdentiqueError,
} from './représentantLégal.errors';

export type ReprésentantLégalEvent =
  | ReprésentantLégalImportéEvent
  | ReprésentantLégalModifiéEvent
  | ChangementReprésentantLégalDemandéEvent
  | ChangementReprésentantLégalCorrigéEvent
  | ChangementReprésentantLégalAccordéEvent
  | ChangementReprésentantLégalRejetéEvent
  | ChangementReprésentantLégalAnnuléEvent
  | ChangementReprésentantLégalSuppriméEvent;

export class ReprésentantLégalAggregate extends AbstractAggregate<ReprésentantLégalEvent> {
  #lauréat!: LauréatAggregate;
  #représentantLégal?: {
    nom: string;
    type: TypeReprésentantLégal.ValueType;
  };
  #demande?: {
    statut: StatutChangementReprésentantLégal.ValueType;
    nom: string;
    type: TypeReprésentantLégal.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    demandéLe: DateTime.ValueType;
    accord?: {
      nom: string;
      type: TypeReprésentantLégal.ValueType;
      accordéLe: string;
    };
    rejet?: {
      motif: string;
      rejetéLe: string;
    };
  };

  get pièceJustificative(): DocumentProjet.ValueType | undefined {
    return this.#demande?.pièceJustificative;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  private get identifiantProjet(): IdentifiantProjet.ValueType {
    return this.#lauréat.projet.identifiantProjet;
  }

  async importer({ nomReprésentantLégal, importéLe, importéPar }: ImporterOptions) {
    if (this.exists) {
      throw new ReprésentantLégalDéjàImportéError();
    }

    const event: ReprésentantLégalImportéEvent = {
      type: 'ReprésentantLégalImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        importéLe: importéLe.formatter(),
        importéPar: importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    identifiantUtilisateur,
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateModification,
  }: ModifierOptions) {
    if (this.#demande?.statut.estDemandé()) {
      throw new DemandeDeChangementEnCoursError();
    }
    if (
      this.#représentantLégal?.nom === nomReprésentantLégal &&
      this.#représentantLégal?.type?.estÉgaleÀ?.(typeReprésentantLégal)
    ) {
      throw new ReprésentantLégalIdentiqueError();
    }
    const event: ReprésentantLégalModifiéEvent = {
      type: 'ReprésentantLégalModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
      },
    };
    await this.publish(event);
  }

  async demander(options: DemanderChangementOptions) {
    // Préconditions métier à adapter selon besoin
    const event: ChangementReprésentantLégalDemandéEvent = {
      type: 'ChangementReprésentantLégalDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal: options.nomReprésentantLégal,
        typeReprésentantLégal: options.typeReprésentantLégal.formatter(),
        demandéLe: options.dateDemande.formatter(),
        demandéPar: options.identifiantUtilisateur.formatter(),
        pièceJustificative: { format: options.pièceJustificative.format },
      },
    };
    await this.publish(event);
  }

  async corrigerChangement(options: CorrigerChangementOptions) {
    const event: ChangementReprésentantLégalCorrigéEvent = {
      type: 'ChangementReprésentantLégalCorrigé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal: options.nomReprésentantLégal,
        typeReprésentantLégal: options.typeReprésentantLégal.formatter(),
        corrigéLe: options.dateCorrection.formatter(),
        corrigéPar: options.identifiantUtilisateur.formatter(),
        pièceJustificative: { format: options.pièceJustificative.format },
      },
    };
    await this.publish(event);
  }

  async accorderChangementReprésentantLégal(options: AccorderOptions) {
    // destructure selon le type d'options (accordAutomatique)
    const { dateAccord, identifiantUtilisateur } = options;
    let nomReprésentantLégal = '';
    let typeReprésentantLégal: TypeReprésentantLégal.ValueType = TypeReprésentantLégal.inconnu;
    if ('accordAutomatique' in options && options.accordAutomatique && this.#demande) {
      nomReprésentantLégal = this.#demande.nom;
      typeReprésentantLégal = this.#demande.type;
    } else if ('nomReprésentantLégal' in options && 'typeReprésentantLégal' in options) {
      nomReprésentantLégal = options.nomReprésentantLégal;
      typeReprésentantLégal = options.typeReprésentantLégal;
    }
    const event: ChangementReprésentantLégalAccordéEvent = {
      type: 'ChangementReprésentantLégalAccordé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        accordAutomatique: 'accordAutomatique' in options ? options.accordAutomatique : false,
        avecCorrection: undefined, // à adapter si besoin
      },
    };
    await this.publish(event);
  }

  async rejeter(options: RejeterOptions) {
    const event: ChangementReprésentantLégalRejetéEvent = {
      type: 'ChangementReprésentantLégalRejeté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        motifRejet: options.motifRejet,
        rejetéLe: options.dateRejet.formatter(),
        rejetéPar: options.identifiantUtilisateur.formatter(),
        rejetAutomatique: options.rejetAutomatique,
      },
    };
    await this.publish(event);
  }

  async annuler(options: AnnulerOptions) {
    const event: ChangementReprésentantLégalAnnuléEvent = {
      type: 'ChangementReprésentantLégalAnnulé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: options.dateAnnulation.formatter(),
        annuléPar: options.identifiantUtilisateur.formatter(),
      },
    };
    await this.publish(event);
  }

  async supprimerDemandeChangement(options: SupprimerOptions) {
    const event: ChangementReprésentantLégalSuppriméEvent = {
      type: 'ChangementReprésentantLégalSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        suppriméLe: options.dateSuppression.formatter(),
        suppriméPar: options.identifiantUtilisateur.formatter(),
      },
    };
    await this.publish(event);
  }

  apply(event: ReprésentantLégalEvent) {
    match(event)
      .with({ type: 'ReprésentantLégalImporté-V1' }, this.applyReprésentantLégalImporté.bind(this))
      .with({ type: 'ReprésentantLégalModifié-V1' }, this.applyReprésentantLégalModifié.bind(this))
      .with(
        { type: 'ChangementReprésentantLégalDemandé-V1' },
        this.applyChangementReprésentantLégalDemandé.bind(this),
      )
      .with(
        { type: 'ChangementReprésentantLégalCorrigé-V1' },
        this.applyChangementReprésentantLégalCorrigé.bind(this),
      )
      .with(
        { type: 'ChangementReprésentantLégalAccordé-V1' },
        this.applyChangementReprésentantLégalAccordé.bind(this),
      )
      .with(
        { type: 'ChangementReprésentantLégalRejeté-V1' },
        this.applyChangementReprésentantLégalRejeté.bind(this),
      )
      .with(
        { type: 'ChangementReprésentantLégalAnnulé-V1' },
        this.applyChangementReprésentantLégalAnnulé.bind(this),
      )
      .with(
        { type: 'ChangementReprésentantLégalSupprimé-V1' },
        this.applyChangementReprésentantLégalSupprimé.bind(this),
      )
      .exhaustive();
  }

  private applyReprésentantLégalImporté({
    payload: { nomReprésentantLégal },
  }: ReprésentantLégalImportéEvent) {
    this.#représentantLégal = {
      nom: nomReprésentantLégal,
      type: TypeReprésentantLégal.inconnu,
    };
  }

  private applyReprésentantLégalModifié({
    payload: { nomReprésentantLégal, typeReprésentantLégal },
  }: ReprésentantLégalModifiéEvent) {
    this.#représentantLégal = {
      nom: nomReprésentantLégal,
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
    };
  }

  private applyChangementReprésentantLégalDemandé({
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative: { format },
      demandéLe,
    },
  }: ChangementReprésentantLégalDemandéEvent) {
    this.#demande = {
      statut: StatutChangementReprésentantLégal.demandé,
      nom: nomReprésentantLégal,
      demandéLe: DateTime.convertirEnValueType(demandéLe),
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
        demandéLe,
        format,
      ),
    };
  }

  private applyChangementReprésentantLégalCorrigé({
    payload: {
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative: { format },
    },
  }: ChangementReprésentantLégalCorrigéEvent) {
    if (this.#demande) {
      this.#demande.nom = nomReprésentantLégal;
      this.#demande.type = TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal);
      this.#demande.pièceJustificative = DocumentProjet.convertirEnValueType(
        this.identifiantProjet.formatter(),
        TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
        this.#demande.demandéLe.formatter(),
        format,
      );
    }
  }

  private applyChangementReprésentantLégalAccordé({
    payload,
  }: ChangementReprésentantLégalAccordéEvent) {
    if (this.#demande) {
      this.#demande.statut = StatutChangementReprésentantLégal.accordé;
      this.#demande.accord = {
        nom: payload.nomReprésentantLégal,
        type: TypeReprésentantLégal.convertirEnValueType(payload.typeReprésentantLégal),
        accordéLe: payload.accordéLe,
      };
    }
  }

  private applyChangementReprésentantLégalRejeté({
    payload,
  }: ChangementReprésentantLégalRejetéEvent) {
    if (this.#demande) {
      this.#demande.statut = StatutChangementReprésentantLégal.rejeté;
      this.#demande.rejet = {
        motif: payload.motifRejet,
        rejetéLe: payload.rejetéLe,
      };
    }
  }

  private applyChangementReprésentantLégalAnnulé(_: ChangementReprésentantLégalAnnuléEvent) {
    this.#demande = undefined;
  }

  private applyChangementReprésentantLégalSupprimé(_: ChangementReprésentantLégalSuppriméEvent) {
    this.#demande = undefined;
  }
}

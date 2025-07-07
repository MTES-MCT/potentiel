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
  ReprésentantLégalTypeInconnuError,
} from './représentantLégal.errors';
import {
  ChangementDéjàAccordéError,
  ChangementDéjàRejetéError,
  DemandeChangementInexistanteError,
} from './changement/changementReprésentantLégal.error';

export type ReprésentantLégalEvent =
  | ReprésentantLégalImportéEvent
  | ReprésentantLégalModifiéEvent
  | ChangementReprésentantLégalDemandéEvent
  | ChangementReprésentantLégalCorrigéEvent
  | ChangementReprésentantLégalAccordéEvent
  | ChangementReprésentantLégalRejetéEvent
  | ChangementReprésentantLégalAnnuléEvent
  | ChangementReprésentantLégalSuppriméEvent;

export class ReprésentantLégalAggregate extends AbstractAggregate<
  ReprésentantLégalEvent,
  'représentant-légal',
  LauréatAggregate
> {
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

  get lauréat() {
    return this.parent;
  }

  private get demande() {
    if (!this.#demande) {
      throw new DemandeChangementInexistanteError();
    }
    return this.#demande;
  }

  private get identifiantProjet(): IdentifiantProjet.ValueType {
    return this.lauréat.projet.identifiantProjet;
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
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#demande?.statut.estDemandé()) {
      throw new DemandeDeChangementEnCoursError();
    }
    this.vérifierQueReprésentantLégalNEstPasIdentique(nomReprésentantLégal, typeReprésentantLégal);

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

  async demanderChangement({
    dateDemande,
    identifiantUtilisateur,
    nomReprésentantLégal,
    pièceJustificative,
    typeReprésentantLégal,
  }: DemanderChangementOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible();

    this.vérifierQueReprésentantLégalNEstPasIdentique(nomReprésentantLégal, typeReprésentantLégal);

    if (typeReprésentantLégal.estInconnu()) {
      throw new ReprésentantLégalTypeInconnuError();
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementReprésentantLégal.demandé,
      );
    }

    const event: ChangementReprésentantLégalDemandéEvent = {
      type: 'ChangementReprésentantLégalDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
        pièceJustificative: { format: pièceJustificative.format },
      },
    };

    await this.publish(event);
  }

  async corrigerDemandeChangement({
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateCorrection,
    identifiantUtilisateur,
    pièceJustificative,
  }: CorrigerChangementOptions) {
    if (this.demande.statut.estAccordé()) {
      throw new ChangementDéjàAccordéError();
    }

    if (this.demande.statut.estRejeté()) {
      throw new ChangementDéjàRejetéError();
    }
    const event: ChangementReprésentantLégalCorrigéEvent = {
      type: 'ChangementReprésentantLégalCorrigé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        corrigéLe: dateCorrection.formatter(),
        corrigéPar: identifiantUtilisateur.formatter(),
        pièceJustificative: { format: pièceJustificative.format },
      },
    };
    await this.publish(event);
  }

  async accorderDemandeChangement(options: AccorderOptions) {
    const demande = this.demande;

    const { dateAccord, identifiantUtilisateur, accordAutomatique } = options;

    demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementReprésentantLégal.accordé,
    );
    const nomReprésentantLégal = match(options)
      .with({ accordAutomatique: true }, () => demande.nom)
      .with({ accordAutomatique: false }, ({ nomReprésentantLégal }) => nomReprésentantLégal)
      .exhaustive();

    const typeReprésentantLégal = match(options)
      .with({ accordAutomatique: true }, () => demande.type)
      .with({ accordAutomatique: false }, ({ typeReprésentantLégal }) => typeReprésentantLégal)
      .exhaustive();

    const event: ChangementReprésentantLégalAccordéEvent = {
      type: 'ChangementReprésentantLégalAccordé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        accordAutomatique,
        avecCorrection: demande.nom !== nomReprésentantLégal ? true : undefined,
      },
    };
    await this.publish(event);
  }

  async rejeterDemandeChangement({
    dateRejet,
    identifiantUtilisateur,
    motifRejet,
    rejetAutomatique,
  }: RejeterOptions) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementReprésentantLégal.rejeté,
    );

    const event: ChangementReprésentantLégalRejetéEvent = {
      type: 'ChangementReprésentantLégalRejeté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        motifRejet,
        rejetéLe: dateRejet.formatter(),
        rejetéPar: identifiantUtilisateur.formatter(),
        rejetAutomatique,
      },
    };

    await this.publish(event);
  }

  async annulerDemandeChangement({ dateAnnulation, identifiantUtilisateur }: AnnulerOptions) {
    this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementReprésentantLégal.annulé,
    );

    const event: ChangementReprésentantLégalAnnuléEvent = {
      type: 'ChangementReprésentantLégalAnnulé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
      },
    };
    await this.publish(event);
  }

  async supprimerDemandeChangement(options: SupprimerOptions) {
    if (!this.#demande) {
      return;
    }
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

  private vérifierQueReprésentantLégalNEstPasIdentique(
    nomReprésentantLégal: string,
    typeReprésentantLégal: TypeReprésentantLégal.ValueType,
  ) {
    if (
      this.#représentantLégal?.nom === nomReprésentantLégal &&
      this.#représentantLégal.type.estÉgaleÀ(typeReprésentantLégal)
    ) {
      throw new ReprésentantLégalIdentiqueError();
    }
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
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative: { format },
    },
  }: ChangementReprésentantLégalCorrigéEvent) {
    if (this.#demande) {
      this.#demande.nom = nomReprésentantLégal;
      this.#demande.type = TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal);
      this.#demande.pièceJustificative = DocumentProjet.convertirEnValueType(
        identifiantProjet,
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

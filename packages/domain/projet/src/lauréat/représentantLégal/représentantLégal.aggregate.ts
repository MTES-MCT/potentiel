import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../index.js';
import { LauréatAggregate } from '../lauréat.aggregate.js';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate.js';
import { DemandeCorrigéeSansModificationError } from '../lauréat.error.js';

import {
  DocumentChangementReprésentantLégal,
  TypeReprésentantLégal,
  TypeTâchePlanifiéeChangementReprésentantLégal,
} from './index.js';

import * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType.js';
import type {
  ReprésentantLégalImportéEvent,
  ReprésentantLégalModifiéEvent,
  ChangementReprésentantLégalDemandéEvent,
  ChangementReprésentantLégalCorrigéEvent,
  ChangementReprésentantLégalAccordéEvent,
  ChangementReprésentantLégalRejetéEvent,
  ChangementReprésentantLégalAnnuléEvent,
  ChangementReprésentantLégalSuppriméEvent,
  ChangementReprésentantLégalEnregistréEvent,
} from './représentantLégal.event.js';
import type { ImporterOptions } from './importer/importerReprésentantLégal.options.js';
import type { ModifierOptions } from './modifier/modifierReprésentantLégal.options.js';
import type { DemanderChangementOptions } from './changement/demander/demanderChangementReprésentantLégal.options.js';
import type { CorrigerChangementOptions } from './changement/corriger/corrigerChangementReprésentantLégal.options.js';
import type { AccorderOptions } from './changement/accorder/accorderChangementReprésentantLégal.options.js';
import type { RejeterOptions } from './changement/rejeter/rejeterChangementReprésentantLégal.options.js';
import type { AnnulerOptions } from './changement/annuler/annulerChangementReprésentantLégal.options.js';
import type { SupprimerOptions } from './changement/supprimer/supprimerChangementReprésentantLégal.options.js';
import {
  DemandeDeChangementEnCoursError,
  ReprésentantLégalDéjàImportéError,
  ReprésentantLégalIdentiqueError,
  ReprésentantLégalTypeInconnuError,
} from './représentantLégal.errors.js';
import {
  ChangementDéjàAccordéError,
  ChangementDéjàRejetéError,
  DemandeChangementInexistanteError,
} from './changement/changementReprésentantLégal.error.js';
import { EnregistrerChangementOptions } from './changement/enregistrer/enregistrerChangementReprésentantLégal.options.js';

export type ReprésentantLégalEvent =
  | ReprésentantLégalImportéEvent
  | ReprésentantLégalModifiéEvent
  | ChangementReprésentantLégalDemandéEvent
  | ChangementReprésentantLégalCorrigéEvent
  | ChangementReprésentantLégalAccordéEvent
  | ChangementReprésentantLégalRejetéEvent
  | ChangementReprésentantLégalAnnuléEvent
  | ChangementReprésentantLégalSuppriméEvent
  | ChangementReprésentantLégalEnregistréEvent;

export class ReprésentantLégalAggregate extends AbstractAggregate<
  ReprésentantLégalEvent,
  'représentant-légal',
  LauréatAggregate
> {
  #tâchePlanifiéeGestionAutomatiqueDemandeChangement!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelInstructionÀDeuxMois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeSuppressionDocumentÀTroisMois!: AggregateType<TâchePlanifiéeAggregate>;

  async init() {
    this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
    );
    this.#tâchePlanifiéeRappelInstructionÀDeuxMois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
    );
    this.#tâchePlanifiéeSuppressionDocumentÀTroisMois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeChangementReprésentantLégal.suppressionDocumentÀTroisMois.type,
    );
  }

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
    raison,
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
        raison,
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
    this.lauréat.vérifierQueLeChangementEstPossible('demande', 'représentantLégal');

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

    await this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement.ajouter({
      àExécuterLe: dateDemande.ajouterNombreDeMois(3),
    });
    await this.#tâchePlanifiéeRappelInstructionÀDeuxMois.ajouter({
      àExécuterLe: dateDemande.ajouterNombreDeMois(2),
    });
  }

  async enregistrerChangement({
    dateChangement,
    identifiantUtilisateur,
    nomReprésentantLégal,
    pièceJustificative,
    typeReprésentantLégal,
  }: EnregistrerChangementOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'représentantLégal');

    this.vérifierQueReprésentantLégalNEstPasIdentique(nomReprésentantLégal, typeReprésentantLégal);

    if (typeReprésentantLégal.estInconnu()) {
      throw new ReprésentantLégalTypeInconnuError();
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementReprésentantLégal.informationEnregistrée,
      );
    }

    const event: ChangementReprésentantLégalEnregistréEvent = {
      type: 'ChangementReprésentantLégalEnregistré-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        pièceJustificative: { format: pièceJustificative.format },
      },
    };

    await this.publish(event);

    await this.#tâchePlanifiéeSuppressionDocumentÀTroisMois.ajouter({
      àExécuterLe: dateChangement.ajouterNombreDeMois(3),
    });
  }

  async corrigerDemandeChangement({
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateCorrection,
    identifiantUtilisateur,
    pièceJustificative,
  }: CorrigerChangementOptions) {
    this.vérifierSiCorrectionEstValide({
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
    });

    const event: ChangementReprésentantLégalCorrigéEvent = {
      type: 'ChangementReprésentantLégalCorrigé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal: typeReprésentantLégal.formatter(),
        corrigéLe: dateCorrection.formatter(),
        corrigéPar: identifiantUtilisateur.formatter(),
        pièceJustificative: pièceJustificative && { format: pièceJustificative.format },
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

    await this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement.annuler();
    await this.#tâchePlanifiéeRappelInstructionÀDeuxMois.annuler();
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

    await this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement.annuler();
    await this.#tâchePlanifiéeRappelInstructionÀDeuxMois.annuler();
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

    await this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement.annuler();
    await this.#tâchePlanifiéeRappelInstructionÀDeuxMois.annuler();
  }

  async supprimerDemandeChangement(options: SupprimerOptions) {
    if (this.#demande) {
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
    await this.#tâchePlanifiéeGestionAutomatiqueDemandeChangement.annuler();
    await this.#tâchePlanifiéeRappelInstructionÀDeuxMois.annuler();
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
      .with(
        { type: 'ChangementReprésentantLégalEnregistré-V1' },
        this.applyChangementReprésentantLégalEnregistré.bind(this),
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
      pièceJustificative: DocumentChangementReprésentantLégal.pièceJustificative({
        identifiantProjet,
        demandéLe,
        pièceJustificative: { format },
      }),
    };
  }

  private applyChangementReprésentantLégalCorrigé({
    payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal, pièceJustificative },
  }: ChangementReprésentantLégalCorrigéEvent) {
    if (this.#demande) {
      this.#demande.nom = nomReprésentantLégal;
      this.#demande.type = TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal);
      if (pièceJustificative) {
        {
          this.#demande.pièceJustificative = DocumentChangementReprésentantLégal.pièceJustificative(
            {
              identifiantProjet,
              demandéLe: this.#demande.demandéLe.formatter(),
              pièceJustificative: { format: pièceJustificative.format },
            },
          );
        }
      }
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
    this.#représentantLégal = {
      nom: payload.nomReprésentantLégal,
      type: TypeReprésentantLégal.convertirEnValueType(payload.typeReprésentantLégal),
    };
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

  private applyChangementReprésentantLégalEnregistré({
    payload: {
      nomReprésentantLégal,
      typeReprésentantLégal,
      enregistréLe,
      identifiantProjet,
      pièceJustificative: { format },
    },
  }: ChangementReprésentantLégalEnregistréEvent) {
    this.#représentantLégal = {
      nom: nomReprésentantLégal,
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
    };
    this.#demande = {
      statut: StatutChangementReprésentantLégal.informationEnregistrée,
      nom: nomReprésentantLégal,
      demandéLe: DateTime.convertirEnValueType(enregistréLe),
      type: TypeReprésentantLégal.convertirEnValueType(typeReprésentantLégal),
      pièceJustificative: DocumentChangementReprésentantLégal.pièceJustificative({
        identifiantProjet,
        demandéLe: enregistréLe,
        pièceJustificative: { format },
      }),
    };
  }

  private applyChangementReprésentantLégalAnnulé(_: ChangementReprésentantLégalAnnuléEvent) {
    this.#demande = undefined;
  }

  private applyChangementReprésentantLégalSupprimé(_: ChangementReprésentantLégalSuppriméEvent) {
    this.#demande = undefined;
  }

  private vérifierSiCorrectionEstValide({
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
  }: Pick<
    CorrigerChangementOptions,
    'nomReprésentantLégal' | 'pièceJustificative' | 'typeReprésentantLégal'
  >) {
    if (
      this.demande.nom === nomReprésentantLégal &&
      this.demande.type.estÉgaleÀ(typeReprésentantLégal) &&
      !pièceJustificative
    ) {
      throw new DemandeCorrigéeSansModificationError();
    }

    if (this.demande.statut.estAccordé()) {
      throw new ChangementDéjàAccordéError();
    }

    if (this.demande.statut.estRejeté()) {
      throw new ChangementDéjàRejetéError();
    }
  }
}

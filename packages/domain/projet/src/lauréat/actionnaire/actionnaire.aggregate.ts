import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate.js';

import { InstructionChangementActionnaire, StatutChangementActionnaire } from './index.js';

import { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event.js';
import {
  ActionnaireDéjàTransmisError,
  DemandeChangementActionnaireImpossibleError,
  ChangementActionnaireInexistanteErreur,
  DemandeDeChangementEnCoursError,
  InstructionObligatoireError,
} from './errors.js';
import { ActionnaireEvent } from './actionnaire.event.js';
import { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event.js';
import { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event.js';
import { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event.js';
import { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event.js';
import { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event.js';
import { ActionnaireImportéEvent } from './importer/importerActionnaire.event.js';
import { ImporterOptions } from './importer/importerActionnaire.options.js';
import { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event.js';
import { ModifierOptions } from './modifier/modifierActionnaire.options.js';
import { DemanderChangementOptions } from './changement/demander/demanderChangementActionnaire.options.js';
import { AccorderChangementOptions } from './changement/accorder/accorderChangementActionnaire.options.js';
import { RejeterChangementOptions } from './changement/rejeter/rejeterChangementActionnaire.options.js';
import { AnnulerChangementOptions } from './changement/annuler/annulerChangementActionnaire.options.js';
import { EnregistrerChangementOptions } from './changement/enregistrerChangement/enregistrerChangementActionnaire.options.js';
import { SupprimerChangementActionnaireOptions } from './changement/supprimer/supprimerChangementActionnaire.options.js';

export class ActionnaireAggregate extends AbstractAggregate<
  ActionnaireEvent,
  'actionnaire',
  LauréatAggregate
> {
  #actionnaire!: string;

  #demande?: {
    statut: StatutChangementActionnaire.ValueType;
    nouvelActionnaire: string;
  };

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({ actionnaire, importéLe }: ImporterOptions) {
    if (this.#actionnaire) {
      throw new ActionnaireDéjàTransmisError();
    }

    const event: ActionnaireImportéEvent = {
      type: 'ActionnaireImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        actionnaire,
        importéLe: importéLe.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifier({
    actionnaire,
    dateModification,
    identifiantUtilisateur,
    raison,
    pièceJustificative,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#demande?.statut.estDemandé()) {
      throw new DemandeDeChangementEnCoursError();
    }

    const event: ActionnaireModifiéEvent = {
      type: 'ActionnaireModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        actionnaire,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative: pièceJustificative && {
          format: pièceJustificative.format,
        },
      },
    };

    await this.publish(event);
  }

  async enregistrerChangement({
    actionnaire,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'actionnaire');

    if (
      this.lauréat.projet.cahierDesChargesActuel.getRèglesChangements('actionnaire')
        .informationEnregistréeEstSoumiseÀConditions
    ) {
      const instructionChangementActionnaire = InstructionChangementActionnaire.bind({
        typeActionnariat: this.lauréat.projet.candidature.typeActionnariat,
        aUnDépotEnCours: this.lauréat.garantiesFinancières.aUnDépôtEnCours,
        aDesGarantiesFinancièresConstituées:
          this.lauréat.garantiesFinancières.aDesGarantiesFinancières,
      });

      if (instructionChangementActionnaire.estRequise()) {
        throw new InstructionObligatoireError();
      }
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementActionnaire.informationEnregistrée,
      );
    }

    const event: ChangementActionnaireEnregistréEvent = {
      type: 'ChangementActionnaireEnregistré-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        actionnaire,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative: pièceJustificative ?? undefined,
      },
    };

    await this.publish(event);
  }

  // Une demande peut être une transmission de documents donc on ne vérifie pas que les valeurs diffèrent
  async demanderChangement({
    identifiantUtilisateur,
    actionnaire,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderChangementOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('demande', 'actionnaire');

    const instructionChangementActionnaire = InstructionChangementActionnaire.bind({
      typeActionnariat: this.lauréat.projet.candidature.typeActionnariat,
      aUnDépotEnCours: this.lauréat.garantiesFinancières.aUnDépôtEnCours,
      aDesGarantiesFinancièresConstituées:
        this.lauréat.garantiesFinancières.aDesGarantiesFinancières,
    });

    if (!instructionChangementActionnaire.estRequise()) {
      throw new DemandeChangementActionnaireImpossibleError();
    }

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
        StatutChangementActionnaire.demandé,
      );
    }

    const event: ChangementActionnaireDemandéEvent = {
      type: 'ChangementActionnaireDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        actionnaire,
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

  async annulerDemandeChangement({
    dateAnnulation,
    identifiantUtilisateur,
  }: AnnulerChangementOptions) {
    if (!this.#demande) {
      throw new ChangementActionnaireInexistanteErreur();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.annulé,
    );

    const event: ChangementActionnaireAnnuléEvent = {
      type: 'ChangementActionnaireAnnulé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async accorderDemandeChangement({
    accordéLe,
    accordéPar,
    réponseSignée,
  }: AccorderChangementOptions) {
    if (!this.#demande) {
      throw new ChangementActionnaireInexistanteErreur();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.accordé,
    );

    const event: ChangementActionnaireAccordéEvent = {
      type: 'ChangementActionnaireAccordé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        accordéLe: accordéLe.formatter(),
        accordéPar: accordéPar.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        nouvelActionnaire: this.#demande.nouvelActionnaire,
      },
    };
    await this.publish(event);
  }

  async rejeterDemandeChangement({ rejetéLe, rejetéPar, réponseSignée }: RejeterChangementOptions) {
    if (!this.#demande) {
      throw new ChangementActionnaireInexistanteErreur();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutChangementActionnaire.rejeté,
    );

    const event: ChangementActionnaireRejetéEvent = {
      type: 'ChangementActionnaireRejeté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        rejetéLe: rejetéLe.formatter(),
        rejetéPar: rejetéPar.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    };

    await this.publish(event);
  }

  async supprimerDemandeChangement({
    identifiantUtilisateur,
    dateSuppression,
  }: SupprimerChangementActionnaireOptions) {
    if (!this.#demande) {
      return;
    }

    const event: ChangementActionnaireSuppriméEvent = {
      type: 'ChangementActionnaireSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        suppriméLe: dateSuppression.formatter(),
        suppriméPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: ActionnaireEvent) {
    match(event)
      .with({ type: 'ActionnaireImporté-V1' }, this.applyActionnaireImporté.bind(this))
      .with({ type: 'ActionnaireModifié-V1' }, this.applyActionnaireModifié.bind(this))
      .with(
        { type: 'ChangementActionnaireEnregistré-V1' },
        this.applyChangementActionnaireEnregistré.bind(this),
      )
      .with(
        { type: 'ChangementActionnaireDemandé-V1' },
        this.applyChangementActionnaireDemandé.bind(this),
      )
      .with(
        { type: 'ChangementActionnaireAnnulé-V1' },
        this.applyChangementActionnaireAnnulé.bind(this),
      )
      .with(
        { type: 'ChangementActionnaireSupprimé-V1' },
        this.applyChangementActionnaireSupprimé.bind(this),
      )

      .with(
        { type: 'ChangementActionnaireAccordé-V1' },
        this.applyChangementActionnaireAccordé.bind(this),
      )
      .with(
        { type: 'ChangementActionnaireRejeté-V1' },
        this.applyChangementActionnaireRejeté.bind(this),
      )
      .exhaustive();
  }

  private applyChangementActionnaireEnregistré({
    payload: { actionnaire },
  }: ChangementActionnaireEnregistréEvent) {
    this.#actionnaire = actionnaire;
  }

  private applyActionnaireImporté({ payload: { actionnaire } }: ActionnaireImportéEvent) {
    this.#actionnaire = actionnaire;
  }

  private applyActionnaireModifié({ payload: { actionnaire } }: ActionnaireModifiéEvent) {
    this.#actionnaire = actionnaire;
  }

  private applyChangementActionnaireDemandé({
    payload: { actionnaire },
  }: ChangementActionnaireDemandéEvent) {
    this.#demande = {
      statut: StatutChangementActionnaire.demandé,
      nouvelActionnaire: actionnaire,
    };
  }

  private applyChangementActionnaireAnnulé(this: ActionnaireAggregate) {
    this.#demande = undefined;
  }

  private applyChangementActionnaireAccordé({
    payload: { nouvelActionnaire },
  }: ChangementActionnaireAccordéEvent) {
    this.#actionnaire = nouvelActionnaire;
    this.#demande = {
      nouvelActionnaire,
      statut: StatutChangementActionnaire.accordé,
    };
  }

  private applyChangementActionnaireRejeté(_: ChangementActionnaireRejetéEvent) {
    this.#demande = undefined;
  }

  private applyChangementActionnaireSupprimé(_: ChangementActionnaireSuppriméEvent) {
    this.#demande = undefined;
  }
}

import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate.js';
import { Lauréat } from '../../index.js';

import { ChangementFournisseurEnregistréEvent, Fournisseur } from './index.js';

import { FournisseurEvent } from './fournisseur.event.js';
import { ImporterOptions } from './importer/importerFournisseur.option.js';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event.js';
import { ModifierÉvaluationCarboneOptions } from './modifier/modifierÉvaluationCarbone.options.js';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event.js';
import {
  ChangementFournisseurValeurIdentiqueError,
  FournisseursIdentiqueError,
  ÉvaluationCarboneIdentiqueError,
  ÉvaluationCarboneNombreError,
  ÉvaluationCarboneNégativeError,
} from './fournisseur.error.js';
import { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event.js';
import { ModifierFournisseurOptions } from './changement/miseAJour/modifierFournisseur.option.js';
import { EnregistrerChangementFournisseurOptions } from './changement/miseAJour/enregistrerChangement.option.js';

export class FournisseurAggregate extends AbstractAggregate<
  FournisseurEvent,
  'fournisseur',
  LauréatAggregate
> {
  #fournisseurs!: Array<Fournisseur.ValueType>;

  #évaluationCarboneSimplifiée!: number;

  get évaluationCarboneSimplifiée() {
    return this.#évaluationCarboneSimplifiée;
  }

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async importer({
    évaluationCarboneSimplifiée,
    importéLe,
    identifiantUtilisateur,
    fournisseurs,
  }: ImporterOptions) {
    const event: FournisseurImportéEvent = {
      type: 'FournisseurImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        évaluationCarboneSimplifiée,
        fournisseurs: fournisseurs.map((fournisseur) => fournisseur.formatter()),
        importéLe: importéLe.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifierÉvaluationCarbone({
    modifiéeLe,
    modifiéePar,
    évaluationCarboneSimplifiée,
  }: ModifierÉvaluationCarboneOptions) {
    this.vérifierÉvaluationCarbone(évaluationCarboneSimplifiée);

    const event: ÉvaluationCarboneModifiéeEvent = {
      type: 'ÉvaluationCarboneSimplifiéeModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
        évaluationCarboneSimplifiée,
      },
    };
    await this.publish(event);
  }

  async enregistrerChangement({
    identifiantProjet,
    fournisseurs,
    évaluationCarboneSimplifiée,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementFournisseurOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'fournisseur');

    if (évaluationCarboneSimplifiée !== undefined && fournisseurs !== undefined) {
      this.vérifierÉvaluationCarboneEtFournisseurs(évaluationCarboneSimplifiée, fournisseurs);
    } else if (évaluationCarboneSimplifiée !== undefined) {
      this.vérifierÉvaluationCarbone(évaluationCarboneSimplifiée);
    } else if (fournisseurs !== undefined) {
      this.vérifierFournisseurs(fournisseurs);
    }

    const event: ChangementFournisseurEnregistréEvent = {
      type: 'ChangementFournisseurEnregistré-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        fournisseurs: fournisseurs?.map((fournisseur) => fournisseur.formatter()),
        évaluationCarboneSimplifiée,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  async modifier({
    identifiantProjet,
    fournisseurs,
    évaluationCarboneSimplifiée,
    dateModification,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: ModifierFournisseurOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (évaluationCarboneSimplifiée !== undefined && fournisseurs !== undefined) {
      this.vérifierÉvaluationCarboneEtFournisseurs(évaluationCarboneSimplifiée, fournisseurs);
    } else if (évaluationCarboneSimplifiée !== undefined) {
      this.vérifierÉvaluationCarbone(évaluationCarboneSimplifiée);
    } else if (fournisseurs !== undefined) {
      this.vérifierFournisseurs(fournisseurs);
    }

    const event: FournisseurModifiéEvent = {
      type: 'FournisseurModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        fournisseurs: fournisseurs?.map((fournisseur) => fournisseur.formatter()),
        évaluationCarboneSimplifiée,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
  }

  /**
   * On vérifie la validité dans le cas où les deux valeurs sont fournies
   * Les valeurs doivent être valides, et au moins l'une des deux doit être modifiée
   */
  private vérifierÉvaluationCarboneEtFournisseurs(
    évaluationCarboneSimplifiée: number,
    fournisseurs: Array<Fournisseur.ValueType>,
  ) {
    try {
      this.vérifierÉvaluationCarbone(évaluationCarboneSimplifiée);
      return;
    } catch (e) {
      if (!(e instanceof ÉvaluationCarboneIdentiqueError)) {
        throw e;
      }
    }
    try {
      this.vérifierFournisseurs(fournisseurs);
      return;
    } catch (e) {
      if (!(e instanceof FournisseursIdentiqueError)) {
        throw e;
      }
    }
    throw new ChangementFournisseurValeurIdentiqueError();
  }

  private vérifierÉvaluationCarbone(évaluationCarboneSimplifiée: number) {
    if (Number.isNaN(évaluationCarboneSimplifiée)) {
      throw new ÉvaluationCarboneNombreError();
    }
    if (évaluationCarboneSimplifiée < 0) {
      throw new ÉvaluationCarboneNégativeError();
    }

    if (évaluationCarboneSimplifiée === this.évaluationCarboneSimplifiée) {
      throw new ÉvaluationCarboneIdentiqueError();
    }
  }

  /** Vérifie que la liste des fournisseurs contient une modification */
  private vérifierFournisseurs(fournisseurs: Array<Fournisseur.ValueType>) {
    if (fournisseurs.length !== this.#fournisseurs.length) {
      return;
    }

    for (let i = 0; i < fournisseurs.length; i++) {
      const fournisseurActuel = this.#fournisseurs[i];
      const fournisseurModifié = fournisseurs[i];
      if (!fournisseurActuel.estÉgaleÀ(fournisseurModifié)) {
        return;
      }
    }
    throw new FournisseursIdentiqueError();
  }

  apply(event: FournisseurEvent): void {
    match(event)
      .with(
        {
          type: 'FournisseurImporté-V1',
        },
        this.applyFournisseurImportéV1.bind(this),
      )
      .with(
        {
          type: 'ÉvaluationCarboneSimplifiéeModifiée-V1',
        },
        this.applyÉvaluationCarboneModifiéeV1.bind(this),
      )
      .with(
        {
          type: 'ChangementFournisseurEnregistré-V1',
        },
        (event) => this.applyFournisseurMisÀJour(event),
      )
      .with({ type: 'FournisseurModifié-V1' }, (event) => this.applyFournisseurMisÀJour(event))
      .exhaustive();
  }

  private applyFournisseurImportéV1({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: FournisseurImportéEvent) {
    this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    this.#fournisseurs = fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType);
  }

  private applyÉvaluationCarboneModifiéeV1({
    payload: { évaluationCarboneSimplifiée },
  }: ÉvaluationCarboneModifiéeEvent) {
    this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
  }

  private applyFournisseurMisÀJour({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: ChangementFournisseurEnregistréEvent | FournisseurModifiéEvent) {
    if (évaluationCarboneSimplifiée !== undefined) {
      this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    }
    if (fournisseurs) {
      this.#fournisseurs = fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType);
    }
  }
}

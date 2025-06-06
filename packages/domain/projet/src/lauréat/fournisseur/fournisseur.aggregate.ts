import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatAggregate } from '../lauréat.aggregate';
import { CahierDesChargesEmpêcheModificationError } from '../lauréat.error';

import { TypeFournisseur } from '.';

import { FournisseurEvent } from './fournisseur.event';
import { ImporterOptions } from './importer/importerFournisseur.option';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { ModifierÉvaluationCarboneOptions } from './modifier/modifierÉvaluationCarbone.options';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';
import {
  ÉvaluationCarboneIdentiqueError,
  ÉvaluationCarboneNombreError,
  ÉvaluationCarboneNégativeError,
} from './fournisseur.error';
import { EnregistrerChangementFournisseurOptions } from './changement/enregistrerChangement/enregistrerChangement.option';
import { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';

export class FournisseurAggregate extends AbstractAggregate<FournisseurEvent> {
  #lauréat!: LauréatAggregate;

  #fournisseurs!: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;

  #évaluationCarboneSimplifiée!: number;

  get évaluationCarboneSimplifiée() {
    return this.#évaluationCarboneSimplifiée;
  }

  get lauréat() {
    return this.#lauréat;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
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
        fournisseurs: fournisseurs.map((fournisseur) => ({
          typeFournisseur: fournisseur.typeFournisseur.formatter(),
          nomDuFabricant: fournisseur.nomDuFabricant,
        })),
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
    if (Number.isNaN(évaluationCarboneSimplifiée)) {
      throw new ÉvaluationCarboneNombreError();
    }
    if (évaluationCarboneSimplifiée < 0) {
      throw new ÉvaluationCarboneNégativeError();
    }

    if (évaluationCarboneSimplifiée === this.évaluationCarboneSimplifiée) {
      throw new ÉvaluationCarboneIdentiqueError();
    }

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
    this.lauréat.vérifierQueLeChangementEstPossible();

    if (
      this.lauréat.projet.période.choisirNouveauCahierDesCharges &&
      this.lauréat.cahierDesCharges.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.initial)
    ) {
      throw new CahierDesChargesEmpêcheModificationError();
    }

    const event: ChangementFournisseurEnregistréEvent = {
      type: 'ChangementFournisseurEnregistré-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        fournisseurs: fournisseurs?.map((fournisseur) => ({
          typeFournisseur: fournisseur.typeFournisseur.formatter(),
          nomDuFabricant: fournisseur.nomDuFabricant,
        })),
        évaluationCarboneSimplifiée,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
      },
    };

    await this.publish(event);
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
        (event) => this.applyChangementFournisseurEnregistré(event),
      )
      .exhaustive();
  }

  private applyFournisseurImportéV1({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: FournisseurImportéEvent) {
    this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    this.#fournisseurs = fournisseurs.map((fournisseur) => ({
      typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
      nomDuFabricant: fournisseur.nomDuFabricant,
    }));
  }

  private applyÉvaluationCarboneModifiéeV1({
    payload: { évaluationCarboneSimplifiée },
  }: ÉvaluationCarboneModifiéeEvent) {
    this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
  }

  private applyChangementFournisseurEnregistré({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: ChangementFournisseurEnregistréEvent) {
    if (évaluationCarboneSimplifiée !== undefined) {
      this.#évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    }
    if (fournisseurs) {
      this.#fournisseurs = fournisseurs.map((fournisseur) => ({
        typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
        nomDuFabricant: fournisseur.nomDuFabricant,
      }));
    }
  }
}

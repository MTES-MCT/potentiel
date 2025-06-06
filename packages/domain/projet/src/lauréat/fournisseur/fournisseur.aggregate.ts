import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatAggregate } from '../lauréat.aggregate';
import { CahierDesChargesEmpêcheModificationError } from '../lauréat.error';

import { TypeFournisseur } from '.';

import { FournisseurEvent } from './fournisseur.event';
import { ImporterOptions } from './importer/importerFournisseur.option';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { EnregistrerChangementFournisseurOptions } from './changement/enregistrerChangement/enregistrerChangement.option';
import { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';

export class FournisseurAggregate extends AbstractAggregate<FournisseurEvent> {
  #lauréat!: LauréatAggregate;

  fournisseurs!: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;

  évaluationCarboneSimplifiée!: number;

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
        (event) => this.applyFournisseurImportéV1(event),
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
    this.évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    this.fournisseurs = fournisseurs.map((fournisseur) => ({
      typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
      nomDuFabricant: fournisseur.nomDuFabricant,
    }));
  }

  private applyChangementFournisseurEnregistré({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: ChangementFournisseurEnregistréEvent) {
    if (évaluationCarboneSimplifiée !== undefined) {
      this.évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    }
    if (fournisseurs) {
      this.fournisseurs = fournisseurs.map((fournisseur) => ({
        typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
        nomDuFabricant: fournisseur.nomDuFabricant,
      }));
    }
  }
}

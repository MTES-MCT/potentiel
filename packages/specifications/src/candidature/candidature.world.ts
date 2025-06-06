import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { CorrigerCandidatureFixture } from './fixtures/corrigerCandidature.fixture';
import { ImporterCandidatureFixture } from './fixtures/importerCandidature.fixture';

export class CandidatureWorld {
  #importerCandidature: ImporterCandidatureFixture;

  get importerCandidature() {
    return this.#importerCandidature;
  }

  #corrigerCandidature: CorrigerCandidatureFixture;
  get corrigerCandidature() {
    return this.#corrigerCandidature;
  }

  #identifiantProjetSansGarantiesFinancières: IdentifiantProjet.ValueType;

  get identifiantProjetSansGarantiesFinancières() {
    return this.#identifiantProjetSansGarantiesFinancières;
  }

  constructor() {
    this.#importerCandidature = new ImporterCandidatureFixture();
    this.#corrigerCandidature = new CorrigerCandidatureFixture();
    this.#identifiantProjetSansGarantiesFinancières =
      IdentifiantProjet.convertirEnValueType(`PPE2 - Innovation#1#1#66`);
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const removeEmptyValues = <T extends object>(obj: T) =>
      Object.fromEntries(
        Object.entries(obj).filter(([, val]) => typeof val !== 'undefined'),
      ) as Partial<T>;
    const mapBoolean = (val: string) => (val ? val === 'oui' : undefined);
    const mapOptionalBoolean = (val: string) =>
      val === 'oui' ? true : val === 'non' ? false : undefined;
    const mapNumber = (val: string) => (val ? Number(val) : undefined);
    const mapDate = (val: string) => (val ? new Date(val).toISOString() : undefined);

    const localitéValue = removeEmptyValues({
      adresse1: exemple['adresse 1'],
      adresse2: exemple['adresse 2'],
      codePostal: exemple['code postal'],
      commune: exemple['commune'],
      région: exemple['région'],
      département: exemple['département'],
    });
    const clearedValues = removeEmptyValues({
      appelOffreValue: exemple["appel d'offre"],
      périodeValue: exemple['période'],
      familleValue: exemple['famille'],
      numéroCREValue: exemple['numéro CRE'],
      typeGarantiesFinancièresValue: exemple['type GF'],
      nomCandidatValue: exemple['nom candidat'],
      technologieValue: exemple['technologie'],
      emailContactValue: exemple['email contact'],
      localitéValue: Object.keys(localitéValue).length > 0 ? localitéValue : undefined,
      puissanceALaPointeValue: mapBoolean(exemple['puissance à la pointe']),
      sociétéMèreValue: exemple['société mère'],
      territoireProjetValue: exemple['territoire projet'],
      dateÉchéanceGfValue: mapDate(exemple["date d'échéance"]),
      historiqueAbandonValue: exemple['historique abandon'],
      puissanceProductionAnnuelleValue: mapNumber(exemple['puissance production annuelle']),
      prixReferenceValue: mapNumber(exemple['prix reference']),
      noteTotaleValue: mapNumber(exemple['note totale']),
      nomReprésentantLégalValue: exemple['nomReprésentant légal'],
      evaluationCarboneSimplifiéeValue: mapNumber(exemple['evaluation carbone simplifiée']),
      valeurÉvaluationCarboneValue: mapNumber(exemple['valeur évalutation carbone']),
      actionnariatValue: exemple['actionnariat'],
      doitRégénérerAttestation: mapBoolean(exemple['doit régénérer attestation']),
      statutValue: exemple['statut'],
    });
    // gérer coefficient K choisi qui, s'il est renseigné, peut être oui, non ou vide
    if (exemple['coefficient K choisi'] != undefined) {
      return {
        ...clearedValues,
        coefficientKChoisiValue: mapOptionalBoolean(exemple['coefficient K choisi']),
      };
    }
    return clearedValues;
  }

  mapToExpected() {
    const { values: expectedValues } = this.corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature
      : this.importerCandidature;
    const misÀJourLe = this.#corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature.values.corrigéLe
      : this.importerCandidature.values.importéLe;
    const détailsMisÀJourLe =
      this.#corrigerCandidature.aÉtéCréé && this.#corrigerCandidature.values.détailsValue
        ? this.corrigerCandidature.values.corrigéLe
        : this.importerCandidature.values.importéLe;

    return {
      localité: expectedValues.localitéValue,
      dateÉchéanceGf: expectedValues.dateÉchéanceGfValue
        ? DateTime.convertirEnValueType(expectedValues.dateÉchéanceGfValue)
        : undefined,
      emailContact: Email.convertirEnValueType(expectedValues.emailContactValue),
      evaluationCarboneSimplifiée: expectedValues.evaluationCarboneSimplifiéeValue,
      historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
        expectedValues.historiqueAbandonValue,
      ),
      identifiantProjet: IdentifiantProjet.convertirEnValueType(
        this.importerCandidature.identifiantProjet,
      ),
      motifÉlimination: expectedValues.motifÉliminationValue,
      nomCandidat: expectedValues.nomCandidatValue,
      nomProjet: expectedValues.nomProjetValue,
      nomReprésentantLégal: expectedValues.nomReprésentantLégalValue,
      noteTotale: expectedValues.noteTotaleValue,
      prixReference: expectedValues.prixRéférenceValue,
      puissanceALaPointe: expectedValues.puissanceALaPointeValue,
      puissanceProductionAnnuelle: expectedValues.puissanceProductionAnnuelleValue,
      sociétéMère: expectedValues.sociétéMèreValue,
      statut: Candidature.StatutCandidature.convertirEnValueType(expectedValues.statutValue),
      technologie: Candidature.TypeTechnologie.convertirEnValueType(
        expectedValues.technologieValue,
      ),
      territoireProjet: expectedValues.territoireProjetValue,
      typeGarantiesFinancières: expectedValues.typeGarantiesFinancièresValue
        ? Candidature.TypeGarantiesFinancières.convertirEnValueType(
            expectedValues.typeGarantiesFinancièresValue,
          )
        : undefined,
      actionnariat: expectedValues.actionnariatValue
        ? Candidature.TypeActionnariat.convertirEnValueType(expectedValues.actionnariatValue)
        : undefined,
      coefficientKChoisi: expectedValues.coefficientKChoisiValue,
      détailsImport: DocumentProjet.convertirEnValueType(
        this.importerCandidature.identifiantProjet,
        'candidature/import',
        détailsMisÀJourLe,
        'application/json',
      ),
      misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
      fournisseurs: expectedValues.fournisseursValue.map((fournisseur) => ({
        typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
          fournisseur.typeFournisseur,
        ),
        nomDuFabricant: fournisseur.nomDuFabricant,
      })),
    };
  }
}

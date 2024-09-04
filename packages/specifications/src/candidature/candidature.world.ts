import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

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
  constructor() {
    this.#importerCandidature = new ImporterCandidatureFixture();
    this.#corrigerCandidature = new CorrigerCandidatureFixture();
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const removeEmptyValues = <T extends object>(obj: T) =>
      Object.fromEntries(
        Object.entries(obj).filter(([, val]) => typeof val !== 'undefined'),
      ) as Partial<T>;
    const mapBoolean = (val: string) => (val ? val === 'oui' : undefined);
    const mapNumber = (val: string) => (val ? Number(val) : undefined);
    const localitéValue = removeEmptyValues({
      adresse1: exemple['adresse 1'],
      adresse2: exemple['adresse 2'],
      codePostal: exemple['code postal'],
      commune: exemple['commune'],
      région: exemple['région'],
      département: exemple['département'],
    });
    return removeEmptyValues({
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
      dateÉchéanceGfValue: exemple['date échéance GF'],
      historiqueAbandonValue: exemple['historique abandon'],
      puissanceProductionAnnuelleValue: mapNumber(exemple['puissance production annuelle']),
      prixReferenceValue: mapNumber(exemple['prix reference']),
      noteTotaleValue: mapNumber(exemple['note totale']),
      nomReprésentantLégalValue: exemple['nomReprésentant légal'],
      evaluationCarboneSimplifiéeValue: mapNumber(exemple['evaluation carbone simplifiée']),
      valeurÉvaluationCarboneValue: mapNumber(exemple['valeur évalutation carbone']),
      financementCollectifValue: mapBoolean(exemple['financement collectif']),
      gouvernancePartagéeValue: mapBoolean(exemple['gouvernance partagée']),
      financementParticipatifValue: mapBoolean(exemple['financement participatif']),
    });
  }

  mapToExpected() {
    const expectedValues = this.importerCandidature.values;
    const misÀJourLe = this.#corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature.corrigéLe
      : this.importerCandidature.values.importéLe;

    return {
      localité: expectedValues.localitéValue,
      dateÉchéanceGf: expectedValues.dateÉchéanceGfValue
        ? DateTime.convertirEnValueType(expectedValues.dateÉchéanceGfValue)
        : undefined,
      emailContact: expectedValues.emailContactValue,
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
      prixReference: expectedValues.prixReferenceValue,
      puissanceALaPointe: expectedValues.puissanceALaPointeValue,
      puissanceProductionAnnuelle: expectedValues.puissanceProductionAnnuelleValue,
      sociétéMère: expectedValues.sociétéMèreValue,
      statut: StatutProjet.convertirEnValueType(expectedValues.statutValue),
      technologie: Candidature.TypeTechnologie.convertirEnValueType(
        expectedValues.technologieValue,
      ),
      territoireProjet: expectedValues.territoireProjetValue,
      typeGarantiesFinancières: expectedValues.typeGarantiesFinancièresValue
        ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
            expectedValues.typeGarantiesFinancièresValue,
          )
        : undefined,
      actionnariat: expectedValues.actionnariatValue
        ? Candidature.TypeActionnariat.convertirEnValueType(expectedValues.actionnariatValue)
        : undefined,
      détails: DocumentProjet.convertirEnValueType(
        this.importerCandidature.identifiantProjet,
        'candidature/import',
        misÀJourLe,
        'application/json',
      ),

      misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    };
  }
}

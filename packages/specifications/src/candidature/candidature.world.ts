import { Candidature, Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { DeepPartial } from '../fixture';

import { CorrigerCandidatureFixture } from './fixtures/corrigerCandidature.fixture';
import { ImporterCandidatureFixture } from './fixtures/importerCandidature.fixture';

type MapExempleToFixtureValuesProps = {
  dépôt: DeepPartial<Candidature.Dépôt.RawType>;
  instruction: DeepPartial<Candidature.Instruction.RawType>;
};

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

  mapExempleToFixtureValues(exemple: Record<string, string>): MapExempleToFixtureValuesProps {
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

    const clearedInstruction: MapExempleToFixtureValuesProps['instruction'] = removeEmptyValues({
      statutValue: exemple['statut'],
      motifÉlimination: exemple["motif d'élimination"],
      noteTotaleValue: mapNumber(exemple['note totale']),
    });
    const clearedDépôt: MapExempleToFixtureValuesProps['dépôt'] = removeEmptyValues({
      appelOffre: exemple["appel d'offre"],
      période: exemple['période'],
      famille: exemple['famille'],
      numéroCRE: exemple['numéro CRE'],
      typeGarantiesFinancières: exemple['type GF'],
      nomCandidat: exemple['nom candidat'],
      technologie: exemple['technologie'],
      emailContact: exemple['email contact'],
      localité: Object.keys(localitéValue).length > 0 ? localitéValue : undefined,
      puissanceALaPointe: mapBoolean(exemple['puissance à la pointe']),
      sociétéMère: exemple['société mère'],
      territoireProjet: exemple['territoire projet'],
      dateÉchéanceGf: mapDate(exemple["date d'échéance"]),
      historiqueAbandon: exemple['historique abandon'],
      puissanceProductionAnnuelle: mapNumber(exemple['puissance production annuelle']),
      prixReference: mapNumber(exemple['prix reference']),
      noteTotale: mapNumber(exemple['note totale']),
      nomReprésentantLégal: exemple['nomReprésentant légal'],
      evaluationCarboneSimplifiée: mapNumber(exemple['evaluation carbone simplifiée']),
      valeurÉvaluationCarbone: mapNumber(exemple['valeur évalutation carbone']),
      actionnariat: exemple['actionnariat'],
      doitRégénérerAttestation: mapBoolean(exemple['doit régénérer attestation']),
      statutValue: exemple['statut'],
      typeInstallationsAgrivoltaiquesValue: exemple['installations agrivoltaïques'],
      élémentsSousOmbrièreValue: exemple['éléments sous ombrière'],
      typologieDeBâtimentValue: exemple['typologie de bâtiment'],
      obligationDeSolarisationValue: mapBoolean(exemple['obligation de solarisation']),
      fournisseursValue: [],
    });

    // gérer coefficient K choisi qui, s'il est renseigné, peut être oui, non ou vide
    if (exemple['coefficient K choisi'] != undefined) {
      clearedDépôt.coefficientKChoisi = mapOptionalBoolean(exemple['coefficient K choisi']);
    }
    return {
      dépôt: clearedDépôt,
      instruction: clearedInstruction,
    };
  }

  mapToExpected() {
    const { values: expectedValues } = this.corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature
      : this.importerCandidature;
    const misÀJourLe = this.#corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature.corrigéLe
      : this.importerCandidature.importéLe;
    const détailsMisÀJourLe =
      this.#corrigerCandidature.aÉtéCréé && this.#corrigerCandidature.détailsValue
        ? this.corrigerCandidature.corrigéLe
        : this.importerCandidature.importéLe;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      this.importerCandidature.identifiantProjet,
    );

    const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
    const période = appelOffres?.periodes.find((p) => p.id === identifiantProjet.période);

    if (!appelOffres || !période) {
      throw new Error('AO ou période inconnue');
    }

    const expected: Candidature.ConsulterCandidatureReadModel = {
      localité: expectedValues.localitéValue,
      dateÉchéanceGf: expectedValues.dateÉchéanceGfValue
        ? DateTime.convertirEnValueType(expectedValues.dateÉchéanceGfValue)
        : undefined,
      emailContact: Email.convertirEnValueType(expectedValues.emailContactValue),
      evaluationCarboneSimplifiée: expectedValues.evaluationCarboneSimplifiéeValue,
      historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
        expectedValues.historiqueAbandonValue,
      ),
      identifiantProjet,
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
      technologie: Candidature.TypeTechnologie.déterminer({
        appelOffre: appelOffres,
        projet: {
          technologie: expectedValues.technologieValue as Candidature.TypeTechnologie.RawType,
        },
      }),
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
      fournisseurs: expectedValues.fournisseursValue.map(
        Lauréat.Fournisseur.Fournisseur.convertirEnValueType,
      ),
      unitéPuissance: Candidature.UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjet.période,
        technologie: Candidature.TypeTechnologie.convertirEnValueType(
          expectedValues.technologieValue,
        ).formatter(),
      }),
      volumeRéservé: Candidature.VolumeRéservé.déterminer({
        note: expectedValues.noteTotaleValue,
        puissanceInitiale: expectedValues.puissanceProductionAnnuelleValue,
        période,
      }),
      typeInstallationsAgrivoltaiques: expectedValues.typeInstallationsAgrivoltaiquesValue
        ? Candidature.TypeInstallationsAgrivoltaiques.convertirEnValueType(
            expectedValues.typeInstallationsAgrivoltaiquesValue,
          )
        : undefined,
      élémentsSousOmbrière: expectedValues.élémentsSousOmbrièreValue,
      typologieDeBâtiment: expectedValues.typologieDeBâtimentValue
        ? Candidature.TypologieBâtiment.convertirEnValueType(
            expectedValues.typologieDeBâtimentValue,
          )
        : undefined,
      obligationDeSolarisation: expectedValues.obligationDeSolarisationValue,
    };

    return expected;
  }
}

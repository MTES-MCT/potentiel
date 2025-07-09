import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { PlainType } from '@potentiel-domain/core';

import { DeepPartial } from '../fixture';

import { CorrigerCandidatureFixture } from './fixtures/corrigerCandidature.fixture';
import { ImporterCandidatureFixture } from './fixtures/importerCandidature.fixture';

type MapExempleToFixtureValuesProps = {
  dépôt: DeepPartial<Candidature.Dépôt.RawType>;
  instruction: DeepPartial<Candidature.Instruction.RawType>;
  identifiantProjet: Partial<PlainType<IdentifiantProjet.ValueType>>;
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
    const mapDate = (val: string) =>
      val ? DateTime.convertirEnValueType(new Date(val)).formatter() : undefined;
    const mapValueType = <TValueType extends { formatter(): TRaw }, TRaw extends string>(
      val: string | undefined,
      convertirEnValueType: (val: string) => TValueType,
    ): TRaw | undefined => (val ? convertirEnValueType(val).formatter() : undefined);

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
      typeGarantiesFinancières: mapValueType(
        exemple['type GF'],
        Candidature.TypeGarantiesFinancières.convertirEnValueType,
      ),
      nomCandidat: exemple['nom candidat'],
      technologie: mapValueType(
        exemple['technologie'],
        Candidature.TypeTechnologie.convertirEnValueType,
      ),
      emailContact: exemple['email contact'],
      localité: Object.keys(localitéValue).length > 0 ? localitéValue : undefined,
      puissanceÀLaPointe: mapBoolean(exemple['puissance à la pointe']),
      sociétéMère: exemple['société mère'],
      territoireProjet: exemple['territoire projet'],
      dateÉchéanceGf: mapDate(exemple["date d'échéance"]),
      historiqueAbandon: mapValueType(
        exemple['historique abandon'],
        Candidature.HistoriqueAbandon.convertirEnValueType,
      ),
      puissanceProductionAnnuelle: mapNumber(exemple['puissance production annuelle']),
      prixRéférence: mapNumber(exemple['prix reference']),
      nomReprésentantLégal: exemple['nomReprésentant légal'],
      évaluationCarboneSimplifiée: mapNumber(exemple['evaluation carbone simplifiée']),
      typeActionnariat: mapValueType(
        exemple['actionnariat'],
        Candidature.TypeActionnariat.convertirEnValueType,
      ),
      typeInstallationsAgrivoltaiques: mapValueType(
        exemple['installations agrivoltaïques'],
        Candidature.TypeInstallationsAgrivoltaiques.convertirEnValueType,
      ),
      élémentsSousOmbrière: exemple['éléments sous ombrière'],
      typologieDeBâtiment: mapValueType(
        exemple['typologie de bâtiment'],
        Candidature.TypologieBâtiment.convertirEnValueType,
      ),
      obligationDeSolarisation: mapBoolean(exemple['obligation de solarisation']),
      fournisseurs: [],
    });

    // gérer coefficient K choisi qui, s'il est renseigné, peut être oui, non ou vide
    if (exemple['coefficient K choisi'] != undefined) {
      clearedDépôt.coefficientKChoisi = mapOptionalBoolean(exemple['coefficient K choisi']);
    }

    const identifiantProjet: MapExempleToFixtureValuesProps['identifiantProjet'] = {
      appelOffre: exemple["appel d'offre"],
      période: exemple['période'],
      famille: exemple['famille'],
      numéroCRE: exemple['numéro CRE'],
    };

    return {
      identifiantProjet,
      dépôt: clearedDépôt,
      instruction: clearedInstruction,
    };
  }

  mapToExpected() {
    const { dépôtValue, instructionValue } = this.corrigerCandidature.aÉtéCréé
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
      dépôt: Candidature.Dépôt.convertirEnValueType(dépôtValue),
      instruction: Candidature.Instruction.convertirEnValueType(instructionValue),
      détailsImport: DocumentProjet.convertirEnValueType(
        this.importerCandidature.identifiantProjet,
        'candidature/import',
        détailsMisÀJourLe,
        'application/json',
      ),
      identifiantProjet,
      misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),

      unitéPuissance: Candidature.UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjet.période,
        technologie: Candidature.TypeTechnologie.convertirEnValueType(
          dépôtValue.technologie,
        ).formatter(),
      }),
      volumeRéservé: Candidature.VolumeRéservé.déterminer({
        note: instructionValue.noteTotale,
        puissanceInitiale: dépôtValue.puissanceProductionAnnuelle,
        période,
      }),
      technologie: Candidature.TypeTechnologie.déterminer({
        appelOffre: appelOffres,
        projet: dépôtValue,
      }),
    };

    return expected;
  }
}

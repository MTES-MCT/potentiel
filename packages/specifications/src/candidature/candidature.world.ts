import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { PlainType } from '@potentiel-domain/core';

import {
  FieldToExempleMapper,
  mapBoolean,
  mapDateTime,
  mapNumber,
  mapOptionalBoolean,
  mapToExemple,
  mapValueType,
} from '../helpers/exempleMapper';

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
    const dépôt = mapToExemple(exemple, dépôtExempleMap);
    const instruction = mapToExemple(exemple, instructionExempleMap);
    const identifiantProjet = mapToExemple(exemple, identifiantProjetExempleMap);
    const localité = mapToExemple(exemple, localitéExempleMap);

    return {
      identifiantProjet,
      dépôt: {
        ...dépôt,
        localité,
      },
      instruction,
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

const dépôtExempleMap: FieldToExempleMapper<
  Omit<Candidature.Dépôt.RawType, 'localité' | 'fournisseurs'>
> = {
  typeGarantiesFinancières: [
    'type GF',
    mapValueType(Candidature.TypeGarantiesFinancières.convertirEnValueType),
  ],
  technologie: ['technologie', mapValueType(Candidature.TypeTechnologie.convertirEnValueType)],
  historiqueAbandon: [
    'historique abandon',
    mapValueType(Candidature.HistoriqueAbandon.convertirEnValueType),
  ],
  actionnariat: ['actionnariat', mapValueType(Candidature.TypeActionnariat.convertirEnValueType)],
  typeInstallationsAgrivoltaiques: [
    'installations agrivoltaïques',
    mapValueType(Candidature.TypeInstallationsAgrivoltaiques.convertirEnValueType),
  ],
  typologieDeBâtiment: [
    'typologie de bâtiment',
    mapValueType(Candidature.TypologieBâtiment.convertirEnValueType),
  ],
  nomProjet: ['nom projet'],
  nomCandidat: ['nom candidat'],
  emailContact: ['email contact'],
  sociétéMère: ['société mère'],
  territoireProjet: ['territoire projet'],
  nomReprésentantLégal: ['nomReprésentant légal'],
  élémentsSousOmbrière: ['éléments sous ombrière'],
  dateÉchéanceGf: ["date d'échéance", mapDateTime],
  puissanceProductionAnnuelle: ['puissance production annuelle', mapNumber],
  prixReference: ['prix reference', mapNumber],
  evaluationCarboneSimplifiée: ['evaluation carbone simplifiée', mapNumber],
  puissanceALaPointe: ['puissance à la pointe', mapBoolean],
  obligationDeSolarisation: ['obligation de solarisation', mapOptionalBoolean],
  coefficientKChoisi: ['coefficient K choisi', mapOptionalBoolean],
};

const instructionExempleMap: FieldToExempleMapper<Candidature.Instruction.RawType> = {
  statut: ['statut', mapValueType(Candidature.StatutCandidature.convertirEnValueType)],
  motifÉlimination: ["motif d'élimination", (val) => val],
  noteTotale: ['note totale', mapNumber],
};

const identifiantProjetExempleMap: FieldToExempleMapper<PlainType<IdentifiantProjet.ValueType>> = {
  appelOffre: ["appel d'offre"],
  période: ['période'],
  famille: ['famille'],
  numéroCRE: ['numéro CRE'],
};

const localitéExempleMap: FieldToExempleMapper<Candidature.Localité.RawType> = {
  adresse1: ['adresse 1'],
  adresse2: ['adresse 2'],
  codePostal: ['code postal'],
  commune: ['commune'],
  région: ['région'],
  département: ['département'],
};

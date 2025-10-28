import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { mapToExemple } from '../helpers/mapToExemple';

import { CorrigerCandidatureFixture } from './fixtures/corrigerCandidature.fixture';
import { ImporterCandidatureFixture } from './fixtures/importerCandidature.fixture';
import {
  autorisationDUrbanismeExempleMap,
  dispositifDeStockageExempleMap,
  dépôtExempleMap,
  formatAttestationGFExempleMap,
  identifiantProjetExempleMap,
  instructionExempleMap,
  localitéExempleMap,
  natureDeLExploitationExempleMap,
} from './candidature.exempleMap';

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
    const autorisationDUrbanisme = mapToExemple(exemple, autorisationDUrbanismeExempleMap);
    const attestationConstitutionGf = mapToExemple(exemple, formatAttestationGFExempleMap);
    const dispositifDeStockage = mapToExemple(exemple, dispositifDeStockageExempleMap);
    const natureDeLExploitation = mapToExemple(exemple, natureDeLExploitationExempleMap);

    return {
      identifiantProjet,
      dépôt: {
        ...dépôt,
        localité,
        autorisationDUrbanisme,
        attestationConstitutionGf,
        dispositifDeStockage,
        natureDeLExploitation,
      },
      instruction,
    };
  }

  mapToExpected() {
    const { dépôtValue, instructionValue } = this.corrigerCandidature.aÉtéCréé
      ? this.corrigerCandidature
      : this.importerCandidature;
    const miseÀJourLe = this.#corrigerCandidature.aÉtéCréé
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
        identifiantProjet.formatter(),
        'candidature/import',
        détailsMisÀJourLe,
        'application/json',
      ),
      identifiantProjet,
      miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),

      unitéPuissance: Candidature.UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjet.période,
        technologie: Candidature.TypeTechnologie.convertirEnValueType(
          dépôtValue.technologie,
        ).formatter(),
      }),
      technologie: Candidature.TypeTechnologie.déterminer({
        appelOffre: appelOffres,
        projet: dépôtValue,
      }),
    };

    return expected;
  }
}

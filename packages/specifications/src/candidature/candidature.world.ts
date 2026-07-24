import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { mapToExemple } from '../helpers/mapToExemple.js';
import {
  autorisationExempleMap,
  coordonnéesExempleMap,
  dispositifDeStockageExempleMap,
  dépôtExempleMap,
  formatAttestationGFExempleMap,
  identifiantProjetExempleMap,
  instructionExempleMap,
  localitéExempleMap,
  natureDeLExploitationExempleMap,
  numéroIdentificationExempleMap,
  raccordementExempleMap,
} from './candidature.exempleMap.js';
import { CorrigerCandidatureFixture } from './fixtures/corrigerCandidature.fixture.js';
import { ImporterCandidatureFixture } from './fixtures/importerCandidature.fixture.js';

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
    const autorisation = mapToExemple(exemple, autorisationExempleMap);
    const attestationConstitutionGf = mapToExemple(exemple, formatAttestationGFExempleMap);
    const dispositifDeStockage = mapToExemple(exemple, dispositifDeStockageExempleMap);
    const natureDeLExploitation = mapToExemple(exemple, natureDeLExploitationExempleMap);
    const raccordement = mapToExemple(exemple, raccordementExempleMap);
    const coordonnées = mapToExemple(exemple, coordonnéesExempleMap);
    const numéroIdentification = mapToExemple(exemple, numéroIdentificationExempleMap);

    return {
      identifiantProjet,
      dépôt: {
        ...dépôt,
        ...(Object.keys(coordonnées).length ? { coordonnées } : {}),
        ...(Object.keys(localité).length ? { localité } : {}),
        ...(Object.keys(numéroIdentification).length
          ? !numéroIdentification.siren && !numéroIdentification.siret
            ? { numéroIdentification: undefined }
            : { numéroIdentification }
          : {}),
        autorisation,
        attestationConstitutionGf,
        dispositifDeStockage,
        natureDeLExploitation,
        raccordements: Object.keys(raccordement).length ? [raccordement] : undefined,
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

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      this.importerCandidature.identifiantProjet,
    );

    const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
    const période = appelOffres?.periodes.find((p) => p.id === identifiantProjet.période);

    if (!appelOffres || !période) {
      throw new Error('AO ou période inconnue');
    }

    const technologie = Candidature.TypeTechnologie.déterminer({
      appelOffre: appelOffres,
      projet: dépôtValue,
    });

    const expected: Candidature.ConsulterCandidatureReadModel = {
      dépôt: Candidature.Dépôt.convertirEnValueType(dépôtValue),

      instruction: Candidature.Instruction.convertirEnValueType(instructionValue),
      identifiantProjet,
      miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),

      unitéPuissance: Candidature.UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjet.période,
        technologie: Candidature.TypeTechnologie.convertirEnValueType(
          dépôtValue.technologie,
        ).formatter(),
      }),
      technologie,
      volumeRéservé: instructionValue.volumeRéservé,
    };

    return expected;
  }
}

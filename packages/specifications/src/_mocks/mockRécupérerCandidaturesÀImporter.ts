import { faker } from '@faker-js/faker';

import type { Période } from '@potentiel-domain/periode';
import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import type { PotentielWorld } from '../potentiel.world.js';

export async function mockRécupérerCandidaturesÀImporter(
  this: PotentielWorld,
  _: Array<{ identifiantProjet: IdentifiantProjet.RawType } & Candidature.Instruction.RawType>,
): ReturnType<Période.RécupérerCandidaturesÀImporterPort> {
  return {
    dossiersValides: this.périodeWorld.importerPériodeFixture.candidatsImportés.map((candidat) => ({
      instruction: candidat.instruction,
      dépôt: candidat.dépôt,
      détails: Object.fromEntries(
        Object.entries(candidat.dépôt).map(([key, value]) => [key, String(value)]),
      ),
      identifiantProjet: candidat.identifiant,
    })),
    dossiersInvalides: [],
    démarcheId: String(faker.number),
  };
}

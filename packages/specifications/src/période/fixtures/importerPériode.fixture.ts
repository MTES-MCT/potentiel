import { faker } from '@faker-js/faker';

import { Email } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../fixture.js';

export type CandidatAvecInstruction = {
  dépôt: Candidature.Dépôt.RawType;
  instruction: Candidature.Instruction.RawType;
  identifiant: IdentifiantProjet.RawType;
};

interface ImporterPériode {
  readonly estImportée: boolean;
  readonly importéeLe: string;
  readonly importéePar: string;
  readonly candidatsImportés: Array<CandidatAvecInstruction>;
  readonly candidatsÀImporter: Array<CandidatAvecInstruction>;
}

export class ImporterPériodeFixture
  extends AbstractFixture<ImporterPériode>
  implements ImporterPériode
{
  #estImportée!: boolean;

  get estImportée(): ImporterPériode['estImportée'] {
    return this.#estImportée;
  }

  #candidatsImportés!: Array<CandidatAvecInstruction>;

  get candidatsImportés(): ImporterPériode['candidatsImportés'] {
    return this.#candidatsImportés;
  }

  #candidatsÀImporter!: Array<CandidatAvecInstruction>;

  get candidatsÀImporter(): ImporterPériode['candidatsÀImporter'] {
    return this.#candidatsÀImporter;
  }

  #importéeLe!: string;

  get importéeLe(): string {
    return this.#importéeLe;
  }

  #importéePar!: string;

  get importéePar(): string {
    return this.#importéePar;
  }

  ajouterCandidatsÀImporter(candidats: CandidatAvecInstruction[]) {
    this.#candidatsÀImporter = candidats;
  }

  créer(partialFixture?: Partial<ImporterPériode>): ImporterPériode {
    const fixture: ImporterPériode = {
      estImportée: true,
      importéeLe: this.#importéeLe ?? faker.date.soon().toISOString(),
      importéePar: this.#importéePar ?? faker.internet.email(),
      candidatsImportés: this.#candidatsÀImporter ?? [],
      candidatsÀImporter: [],
      ...partialFixture,
    };

    this.#importéeLe = fixture.importéeLe;
    this.#importéePar = fixture.importéePar;
    this.#candidatsImportés = fixture.candidatsImportés;

    this.aÉtéCréé = true;
    this.#candidatsÀImporter = [];

    return fixture;
  }

  mapCandidatsToExpected(): Candidature.CandidaturesListItemReadModel[] {
    return this.#candidatsImportés.map((candidat) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(candidat.identifiant);
      const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
      if (!appelOffres) {
        throw new Error("Appel d'offres inconnu");
      }
      return {
        identifiantProjet,
        statut: Candidature.StatutCandidature.convertirEnValueType(candidat.instruction.statut),
        nomProjet: candidat.dépôt.nomProjet,
        appelOffres: identifiantProjet.appelOffre,
        emailContact: Email.convertirEnValueType(candidat.dépôt.emailContact),
        estNotifiée: false,
        evaluationCarboneSimplifiée: candidat.dépôt.evaluationCarboneSimplifiée,
        localité: Candidature.Localité.bind(candidat.dépôt.localité),
        nomCandidat: candidat.dépôt.nomCandidat,
        nomReprésentantLégal: candidat.dépôt.nomReprésentantLégal,
        prixReference: candidat.dépôt.prixReference,
        puissance: candidat.dépôt.puissance,
        période: identifiantProjet.appelOffre,
        unitéPuissance: Candidature.UnitéPuissance.déterminer({
          appelOffres: appelOffres,
          période: identifiantProjet.période,
          technologie: candidat.dépôt.technologie,
        }),
      } satisfies Candidature.CandidaturesListItemReadModel;
    });
  }
}

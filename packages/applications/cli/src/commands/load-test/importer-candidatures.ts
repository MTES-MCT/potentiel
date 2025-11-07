import { Command, Flags } from '@oclif/core';
import zod from 'zod';
import { mediator } from 'mediateur';

import {
  Candidature,
  Document,
  IdentifiantProjet,
  registerProjetUseCases,
} from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { DocumentAdapter, ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { DateTime, Email } from '@potentiel-domain/common';
import { getDossier } from '@potentiel-infrastructure/ds-api-client';

const envSchema = zod.object({
  APPLICATION_STAGE: zod.string(),
  DATABASE_CONNECTION_STRING: zod.url(),
  DS_API_URL: zod.url(),
  DS_API_TOKEN: zod.string(),
});

export class ImporterCandidatures extends Command {
  static flags = {
    occurrences: Flags.integer({
      default: 100,
    }),
    dossier: Flags.integer({
      description: 'Numéro du dossier dans démarches simplifiées, importé N fois',
      required: true,
    }),
    appelOffre: Flags.string({ options: appelsOffreData.map((ao) => ao.id), required: true }),
    periode: Flags.integer({ max: 100, required: true }),
    reuse: Flags.boolean(),
    skipDocuments: Flags.boolean(),
  };

  async init() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);
    if (APPLICATION_STAGE === 'production') {
      console.log(`This job can't be executed on ${APPLICATION_STAGE} environment`);
      this.exit(1);
    }
    const { flags } = await this.parse(ImporterCandidatures);

    if (flags.skipDocuments) {
      Document.registerDocumentProjetCommand({
        enregistrerDocumentProjet: async () => {},
        archiverDocumentProjet: async () => {},
        déplacerDossierProjet: async () => {},
      });
    } else {
      Document.registerDocumentProjetCommand({
        enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
        déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
        archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      });
    }

    registerProjetUseCases({
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
  }

  async run() {
    const { faker } = await import('@faker-js/faker');

    const importId = faker.string.uuid().slice(0, 8);

    console.log(`--- Début du job d'import de candidatures (Import ${importId}) ---`);
    const { flags } = await this.parse(ImporterCandidatures);
    const { occurrences, appelOffre, periode, dossier: numeroDossierDS, reuse } = flags;
    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    const instructions = Array(occurrences)
      .fill(null)
      .map((_, i) => ({
        numeroDossierDS,
        identifiantProjet: IdentifiantProjet.bind({
          appelOffre,
          période: String(periode),
          famille: '',
          numéroCRE: `${numeroDossierDS}_${importId}_${i}`,
        }).formatter(),
        statut: faker.helpers.arrayElement(Candidature.StatutCandidature.statuts),
        note: faker.number.int({ min: 0, max: 100 }),
        motifElimination: faker.lorem.sentence(),
      }));

    const start = process.hrtime.bigint();

    for (const {
      numeroDossierDS,
      identifiantProjet,
      statut,
      note,
      motifElimination,
    } of instructions) {
      const dossier =
        reuse && candidatures[0]
          ? {
              dépôt: candidatures[0].dépôtValue,
              demarcheId: '',
              fichiers: { garantiesFinancières: undefined },
            }
          : await getDossier(numeroDossierDS);

      if (Option.isNone(dossier)) {
        throw new Error(`Le dossier ${numeroDossierDS} est introuvable`);
      }

      const dépôt = dossier.dépôt;
      const instruction: Candidature.Instruction.RawType = {
        statut,
        noteTotale: note,
        motifÉlimination: motifElimination,
      };

      candidatures.push({
        identifiantProjetValue: identifiantProjet,
        dépôtValue: { ...dépôt, puissanceALaPointe: false } as Candidature.Dépôt.RawType,
        détailsValue: {
          typeImport: 'démarches-simplifiées',
        },
        instructionValue: instruction,
      });
    }

    const endApiCalls = process.hrtime.bigint();
    const durationAPICalls = Number(endApiCalls - start) / 1_000_000;
    this.log(
      `Chargement de ${occurrences} candidatures depuis l'API DS en ${durationAPICalls.toFixed(2)}ms (${(
        durationAPICalls / occurrences
      ).toFixed(2)}ms/candidature)`,
    );

    let importées = 0;
    setInterval(() => {
      console.log(`${importées}/${occurrences} candidatures importées`);
    }, 1000).unref();
    for (const {
      identifiantProjetValue,
      dépôtValue,
      instructionValue,
      détailsValue,
    } of candidatures) {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: {
          identifiantProjetValue,
          dépôtValue,
          instructionValue,
          détailsValue,
          importéLe: DateTime.now().formatter(),
          importéPar: Email.système.formatter(),
        },
      });
      importées++;
    }
    const end = process.hrtime.bigint();
    const durationTotal = Number(end - start) / 1_000_000;
    const duractionImport = Number(end - endApiCalls) / 1_000_000;
    this.log(
      `Import de ${occurrences} candidatures terminé en ${duractionImport.toFixed(2)}ms (${(
        duractionImport / occurrences
      ).toFixed(2)}ms/candidature)`,
    );

    this.log(
      `Total (API+import): ${occurrences} candidatures en ${durationTotal.toFixed(2)}ms (${(
        durationTotal / occurrences
      ).toFixed(2)}ms/candidature)`,
    );
  }
}

import { Command, Flags } from '@oclif/core';
import zod from 'zod';
import { faker } from '@faker-js/faker';
import { mediator } from 'mediateur';

import {
  Candidature,
  IdentifiantProjet,
  ProjetAggregateRoot,
  registerProjetUseCases,
} from '@potentiel-domain/projet';
import { getDépôtCandidature } from '@potentiel-infrastructure/ds-api-client';
import { Option } from '@potentiel-libraries/monads';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { AppelOffreAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { DateTime, Email } from '@potentiel-domain/common';
import { registerDocumentProjetCommand } from '@potentiel-domain/document';

const envSchema = zod.object({
  APPLICATION_STAGE: zod.string(),
  DATABASE_CONNECTION_STRING: zod.url(),
  DS_API_URL: zod.url(),
  DS_API_TOKEN: zod.string(),
});

export class ImportCandidature extends Command {
  static flags = {
    occurences: Flags.integer({
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
    const { flags } = await this.parse(ImportCandidature);

    if (flags.skipDocuments) {
      registerDocumentProjetCommand({
        enregistrerDocumentProjet: async () => {},
        archiverDocumentProjet: async () => {},
        déplacerDossierProjet: async () => {},
      });
    } else {
      registerDocumentProjetCommand({
        enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
        déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
        archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      });
    }

    registerProjetUseCases({
      getProjetAggregateRoot: (identifiantProjet) =>
        ProjetAggregateRoot.get(identifiantProjet, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
  }

  async run() {
    const { flags } = await this.parse(ImportCandidature);
    const { occurences, appelOffre, periode, dossier: numeroDossierDS, reuse } = flags;
    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    const instructions = Array(occurences)
      .fill(null)
      .map((_, i) => ({
        numeroDossierDS,
        identifiantProjet: IdentifiantProjet.bind({
          appelOffre,
          période: String(periode),
          famille: '',
          numéroCRE: numeroDossierDS + '_' + i,
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
          : await getDépôtCandidature(numeroDossierDS);

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
        dépôtValue: dépôt as Candidature.Dépôt.RawType,
        détailsValue: {
          typeImport: 'démarches-simplifiées',
          demarcheId: dossier.demarcheId,
          pièceJustificativeGf: dossier.fichiers.garantiesFinancières?.url ?? '',
        },
        instructionValue: instruction,
      });
    }

    const endApiCalls = process.hrtime.bigint();
    const durationAPICalls = Number(endApiCalls - start) / 1_000_000;
    this.log(
      `Chargement de ${occurences} candidatures depuis l'API DS en ${durationAPICalls.toFixed(2)}ms (${(
        durationAPICalls / occurences
      ).toFixed(2)}ms/candidature)`,
    );
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
          importéPar: Email.system().formatter(),
        },
      });
    }
    const end = process.hrtime.bigint();
    const durationTotal = Number(end - start) / 1_000_000;
    this.log(
      `Import de ${occurences} candidatures terminé en ${durationTotal.toFixed(2)}ms (${(
        durationTotal / occurences
      ).toFixed(2)}ms/candidature)`,
    );
  }
}

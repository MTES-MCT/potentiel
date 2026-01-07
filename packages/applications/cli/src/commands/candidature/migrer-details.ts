import { readdir } from 'fs/promises';

import { Command } from '@oclif/core';
import * as z from 'zod';

import { getLogger, Logger } from '@potentiel-libraries/monitoring';
import { registerProjetUseCases } from '@potentiel-domain/projet';
import { ProjetAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

const configSchema = z.object({
  DATABASE_CONNECTION_STRING: z.url(),
  PATH_TO_FILES: z.string(),
});

// const cleanDétails = (détails: Candidature.DétailCandidatureRaw) =>
//   Object.entries(détails).reduce((détail, [key, value]) => {
//     if (key !== '' && value !== '' && value !== undefined) {
//       détail[key] = value;
//     }
//     return détail;
//   }, {} as Candidature.DétailCandidature);

export class MigrerDetailsCommand extends Command {
  #logger!: Logger;

  async init() {
    this.#logger = getLogger();

    registerProjetUseCases({
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
    });
  }

  async run() {
    const { PATH_TO_FILES } = configSchema.parse(process.env);

    this.#logger.info('🚀 Create détail-candidature projection');

    const errors = [];
    try {
      const projectDirectories = await readdir(PATH_TO_FILES);

      if (projectDirectories.length === 0) {
        this.#logger.info('✅ No files to process');
        return;
      }

      let count = 1;

      for (const projectDirectory of projectDirectories) {
        await new Promise((resolve) => setTimeout(resolve, 10));

        this.#logger.info(`Processing project ${count} of ${projectDirectories.length}`);

        const dossierImport = `${PATH_TO_FILES}/${projectDirectory}/candidature/import`;

        try {
          const importFiles = await readdir(dossierImport);

          if (importFiles.length === 0) {
            this.#logger.info(`No import files for project : ${projectDirectory}`);
            count++;
            continue;
          }

          for (const importFile of importFiles) {
            try {
              // const détailString = await readFile(`${dossierImport}/${importFile}`, 'utf-8');

              // const détailRaw: Candidature.DétailCandidatureRaw = JSON.parse(détailString);
              // const détail = cleanDétails(détailRaw);

              // const identifiantProjet = IdentifiantProjet.convertirEnValueType(projectDirectory);

              if (importFile.includes('/')) {
                console.log('🫠', importFile);
              }

              // const importéLe = DateTime.convertirEnValueType(importFile.replace('.json', ''));

              // const projet = await ProjetAdapter.getProjetAggregateRootAdapter(identifiantProjet);

              // await projet.candidature.importerDétail({
              //   détail,
              //   importéLe,
              //   importéPar: Email.système,
              // });
            } catch (error) {
              errors.push(
                `❌ Error migrating file ${importFile} for project : ${projectDirectory}: ${error}`,
              );
            } finally {
              count++;
            }
          }
        } catch (error) {
          errors.push(
            `❌ Error reading import directory for project ${projectDirectory}: ${error}`,
          );
          count++;
          continue;
        }
      }

      if (errors.length === 0) {
        this.#logger.info('✅  All details migrated successfully');
      } else {
        this.#logger.error('⚠️ Some errors occurred during the migration ⚠️');

        for (const error of errors) {
          this.#logger.error(error);
        }
        process.exit(1);
      }
    } catch (error) {
      errors.push(`❌ Error during migration ${error}`);
    }
  }
}

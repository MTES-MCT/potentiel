import { writeFile } from 'node:fs/promises';

import { Args, Command, Flags } from '@oclif/core';
import type { Faker } from '@faker-js/faker';

import { getDémarcheAvecDossiers } from '@potentiel-infrastructure/ds-api-client';
import { Option } from '@potentiel-libraries/monads';
import { ExportCSV } from '@potentiel-libraries/csv';

export class ListerDossiersCandidatureCommand extends Command {
  static args = {
    démarche: Args.integer({ required: true }),
  };
  static flags = {
    instruction: Flags.boolean({
      description: "Génère un fichier CSV d'instruction avec les dossiers de la démarche",
    }),
  };

  async run() {
    const { args, flags } = await this.parse(ListerDossiersCandidatureCommand);
    try {
      const dossiers = await getDémarcheAvecDossiers(args.démarche);
      console.log(dossiers);

      if (Option.isNone(dossiers)) {
        throw new Error(`La démarche ${args.démarche} est introuvable`);
      }

      if (flags.instruction) {
        // Faker est importé dynamiquement car c'est une dev dependency, et n'est pas dispo en env de prod
        const { fakerFR } = await import('@faker-js/faker');
        const faker = fakerFR as unknown as Faker;
        const data = dossiers.map((dossier) => {
          const statut = faker.helpers.arrayElement(['retenu', 'éliminé']);
          return {
            numeroDossierDS: dossier.numeroDS,
            statut,
            motifElimination:
              statut === 'éliminé' ? faker.lorem.words({ min: 8, max: 16 }) : undefined,
            note: faker.number.int({ min: 10, max: 100 }).toString(),
          };
        });
        const fields = ['numeroDossierDS', 'statut', 'motifElimination', 'note'];

        const csv = await ExportCSV.parseJson({
          data,
          fields,
        });

        await writeFile('instruction-ds-cre.csv', csv);
        console.log("Fichier d'instruction créé: instruction-ds-cre.csv");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

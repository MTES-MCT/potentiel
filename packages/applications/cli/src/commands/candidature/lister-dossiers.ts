import { writeFile } from 'node:fs/promises';

import { Parser } from '@json2csv/plainjs';
import { Args, Command, Flags } from '@oclif/core';
import type { Faker } from '@faker-js/faker';

import { getDossiersDemarche } from '@potentiel-infrastructure/ds-api-client';
import { Option } from '@potentiel-libraries/monads';

export class ListerDossiersCandidatureCommand extends Command {
  static args = {
    démarche: Args.integer({ required: true }),
  };
  static flags = {
    instruction: Flags.boolean({
      description: "Génère un fichier CSV d'instruction avec les dossiers de la démarche",
    }),
  };

  #faker!: Faker;
  protected async init() {
    // Faker est importé dynamiquement car c'est une dev dependency, et n'est pas dispo en env de prod
    const { fakerFR } = await import('@faker-js/faker');
    this.#faker = fakerFR as unknown as Faker;
  }

  async run() {
    const { args, flags } = await this.parse(ListerDossiersCandidatureCommand);
    try {
      const dossiers = await getDossiersDemarche(args.démarche);

      if (Option.isNone(dossiers)) {
        throw new Error(`La démarche ${args.démarche} est introuvable`);
      }

      if (flags.instruction) {
        const data = dossiers.map((dossier) => {
          const statut = this.#faker.helpers.arrayElement(['retenu', 'éliminé']);
          return {
            numeroDossierDS: dossier.numeroDS,
            statut,
            motifElimination:
              statut === 'éliminé' ? this.#faker.lorem.words({ min: 8, max: 16 }) : undefined,
            note: this.#faker.number.int({ min: 10, max: 100 }).toString(),
          };
        });
        const fields = ['numeroDossierDS', 'statut', 'motifElimination', 'note'];
        const csvParser = new Parser({ fields, delimiter: ';', withBOM: true });
        const csv = csvParser.parse(data);
        await writeFile('instruction-ds-cre.csv', csv);
        console.log("Fichier d'instruction créé: instruction-ds-cre.csv");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

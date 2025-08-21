import { writeFile } from 'node:fs/promises';

import { Parser } from '@json2csv/plainjs';
import { Args, Command, Flags } from '@oclif/core';
import { faker } from '@faker-js/faker';

import { getDossiersDemarche } from '@potentiel-infrastructure/ds-api-client';

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
      const dossiers = await getDossiersDemarche(args.démarche);
      console.log(dossiers);

      if (flags.instruction) {
        const data = dossiers.map((numeroDossierDS) => {
          const statut = faker.helpers.arrayElement(['retenu', 'éliminé']);
          return {
            numeroDossierDS,
            statut,
            motifElimination:
              statut === 'éliminé' ? faker.lorem.words({ min: 8, max: 16 }) : undefined,
            note: faker.number.int({ min: 10, max: 100 }).toString(),
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

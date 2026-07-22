import { writeFile } from 'node:fs/promises';

import type { Faker } from '@faker-js/faker';
import { Args, Command, Flags } from '@oclif/core';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { getDémarcheAvecDossiers } from '@potentiel-infrastructure/dn-api-client';
import { ExportCSV } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';

import { dsSchema } from '#helpers';

export class ListerDossiersCandidatureCommand extends Command {
  static args = {
    démarche: Args.integer({ required: true }),
    appelOffres: Args.string({ required: true }),
    période: Args.string({ required: true }),
  };
  static flags = {
    instruction: Flags.boolean({
      description: "Génère un fichier CSV d'instruction avec les dossiers de la démarche",
    }),
  };

  async init() {
    dsSchema.parse(process.env);
  }

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

        const hasVolumeRéservé = isAppelOffresAvecVolumeRéservé({
          appelOffres: args.appelOffres,
          période: args.période,
        });

        const data = dossiers.map((dossier) => {
          const statut = faker.helpers.arrayElement(['retenu', 'éliminé']);
          return {
            numeroDossierDN: dossier.numeroDN,
            statut,
            motifElimination:
              statut === 'éliminé' ? faker.lorem.words({ min: 8, max: 16 }) : undefined,
            note: faker.number.int({ min: 10, max: 100 }).toString(),
            volumeReserve: hasVolumeRéservé
              ? faker.helpers.arrayElement(['oui', 'non'])
              : undefined,
          };
        });
        const csv = await ExportCSV.toCSV({
          data,
          fields: ['numeroDossierDN', 'statut', 'motifElimination', 'note', 'volumeReserve'],
        });

        await writeFile('instruction-dn-cre.csv', csv);
        console.log("Fichier d'instruction créé: instruction-ds-cre.csv");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const isAppelOffresAvecVolumeRéservé = ({
  appelOffres,
  période,
}: {
  appelOffres: string;
  période: string;
}) => {
  const appelOffresDetails = appelsOffreData.find((ao) => ao.id === appelOffres);
  const périodeDetails = appelOffresDetails?.periodes.find((p) => p.id === période);
  return périodeDetails?.volumeRéservé !== undefined;
};

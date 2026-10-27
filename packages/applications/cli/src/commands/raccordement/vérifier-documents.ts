import fs from 'node:fs';
import path from 'node:path';

import { Command } from '@oclif/core';
import z from 'zod';

import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { fileExists } from '@potentiel-libraries/file-storage';

import { appSchema, dbSchema, s3Schema } from '#helpers';

const envSchema = z.object({ ...dbSchema.shape, ...s3Schema.shape, ...appSchema.shape });

export class VérifierDocumentsRaccordementCommand extends Command {
  static description = 'Vérifier les documents raccordement';

  async init() {
    envSchema.parse(process.env);
  }

  async run(): Promise<void> {
    const data = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          propositionTechniqueEtFinancière: {
            document: {
              format: Where.notEqualNull(),
            },
          },
        },
        range: {
          startPosition: 0,
          endPosition: 3000,
        },
      },
    );

    const stats = {
      total: data.items.length,
      existant: 0,
      absent: 0,
      absentDétails: [] as Array<Lauréat.Raccordement.DossierRaccordement>,
      erreur: 0,
    };

    console.log(`Starting test for ${stats.total} documents`);

    for (const dossier of data.items) {
      try {
        const document = Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière(
          {
            identifiantProjet: dossier.identifiantProjet,
            // biome-ignore lint/style/noNonNullAssertion: throwaway code
            dateSignature: dossier.propositionTechniqueEtFinancière!.dateSignature!,
            référenceDossierRaccordement: dossier.référence,
            propositionTechniqueEtFinancièreSignée:
              dossier.propositionTechniqueEtFinancière?.document,
          },
        );

        const doc = await fileExists(document.formatter());

        if (doc) {
          console.log(`✅ Document existant`);
          stats.existant++;
        } else {
          console.log(
            `❌ Document manquant pour le projet ${dossier.identifiantProjet} type ${dossier.type}`,
          );
          stats.absent++;
          stats.absentDétails.push(dossier);
        }
      } catch (e) {
        console.error(
          `❌ Erreur pour le projet ${dossier.identifiantProjet} type ${dossier.type} : ${e}`,
        );
        stats.erreur++;
      }
    }

    const outputPath = path.join(process.cwd(), 'erreurs_migration.json');
    fs.writeFileSync(outputPath, JSON.stringify(stats.absentDétails, null, 2), 'utf-8');

    console.log(
      `\r⏳ ${stats.total} TOTAL / ${stats.erreur} documents non existants / ${stats.existant} docs ok`,
    );
    console.log(`⚠️ Fichier des erreurs généré : ${outputPath}`);
  }
}

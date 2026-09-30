import { Command, Flags } from '@oclif/core';
import z from 'zod';

import { Where } from '@potentiel-domain/entity';
import { Document, type Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

import { dbSchema } from '#helpers';

const envSchema = z.object(dbSchema.shape);

export class CorrigerRéférenceRaccordementCommand extends Command {
  static description = 'Corriger les références de raccordement non compatible avec S3';

  static override flags = {
    dryRun: Flags.boolean({ name: 'dryRun' }),
    identifiantProjet: Flags.string(),
  };

  async init() {
    envSchema.parse(process.env);

    Document.registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
    });
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(CorrigerRéférenceRaccordementCommand);

    const data = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          demandeComplèteRaccordement: {
            accuséRéception: {
              format: Where.notEqualNull(),
            },
          },
          identifiantProjet: flags.identifiantProjet
            ? Where.equal(flags.identifiantProjet)
            : undefined,
        },
        range: {
          startPosition: 0,
          endPosition: 6000,
        },
      },
    );

    const contientCaractèresMalveillants = /['?*:;{}/\\]/;

    const dossiersÀCorriger = data.items.filter((dossier) =>
      contientCaractèresMalveillants.test(dossier.référence),
    );

    const stats = {
      total: data.items.length,
      déjàOk: 0,
      pasOkCorrigé: 0,
      pasOkAvecErreur: 0,
    };

    console.log(`Starting correction for ${dossiersÀCorriger.length} dossiers`);

    for (const dossier of dossiersÀCorriger) {
      try {
        // vérifier qu'on peut télécharger l'accusé de réception
        // Si non : on l'enregistre avec le bon path
        // bonus : supprimer le "mauvais" dossier
      } catch (e) {}
    }

    process.stdout.write(
      `\r⏳ ${stats.total} TOTAL / ${stats.déjàOk} sans problème / ${stats.pasOkAvecErreur} avec problème non corrigé / ${stats.déjàOk} CORRIGEE AVEC SUCCES`,
    );
  }
}

import { Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { type LeftJoin, Where } from '@potentiel-domain/entity';
import { Document, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

import { dbSchema } from '#helpers';

const envSchema = z.object(dbSchema.shape);

export class CorrigerRéférenceRaccordementCommand extends Command {
  static description = 'Corriger les références de raccordement avec des caractères interdits';

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

    const data = await listProjection<
      Lauréat.Raccordement.DossierRaccordementEntity,
      LeftJoin<Lauréat.LauréatEntity>
    >(`dossier-raccordement`, {
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
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        type: 'left',
        where: {
          statut: Where.notEqual(Lauréat.StatutLauréat.abandonné.statut),
        },
      },
      range: {
        startPosition: 0,
        endPosition: 6000,
      },
    });

    const dossiersÀCorriger = data.items.filter((dossier) =>
      /['?*:;{}/\\]/.test(dossier.référence),
    );

    const stats = {
      total: data.items.length,
      corrigé: 0,
      erreur: 0,
    };

    console.log(`Starting correction for ${dossiersÀCorriger.length} dossiers`);

    for (const dossier of dossiersÀCorriger) {
      try {
        console.log(dossier.identifiantProjet, dossier.référence);

        // ancien path avec erreur
        const dossierActuel = Document.DossierProjet.convertirEnValueType({
          identifiantProjet: dossier.identifiantProjet,
          typeDocument: dossier.référence,
        });

        // nouveau path sans erreur
        const nouveauDossier = Lauréat.Raccordement.DocumentRaccordement.dossierProjetRaccordement(
          dossier.identifiantProjet,
          dossier.référence,
        );

        await mediator.send<Document.DéplacerDossierProjetCommand>({
          type: 'Document.Command.DéplacerDossierProjet',
          data: {
            dossierProjetSource: dossierActuel,
            dossierProjetTarget: nouveauDossier.dossier,
          },
        });

        console.log(
          `✅ Projet ${dossier.identifiantProjet} référence ${dossier.référence} corrigé`,
        );
        stats.corrigé++;
      } catch (e) {
        console.error(
          `❌ Erreur pour le projet ${dossier.identifiantProjet} référence ${dossier.référence} : ${e}`,
        );
        stats.erreur++;
      }
    }

    process.stdout.write(
      `\r⏳ ${stats.total} TOTAL / ${stats.erreur} avec problème non corrigé / ${stats.corrigé} CORRIGEE AVEC SUCCES`,
    );
  }
}

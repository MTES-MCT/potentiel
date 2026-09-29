import fs from 'node:fs';
import path from 'node:path';

import { Command, Flags } from '@oclif/core';
import { getDocument } from 'pdfjs-dist';

import { DateTime, Email } from '@potentiel-domain/common';
import { Where } from '@potentiel-domain/entity';
import { Document, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter, ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { download, FichierInexistant } from '@potentiel-libraries/file-storage';

export class RattraperHistoriqueDocumentsCommand extends Command {
  static description = "Rattraper l'historique des documents PTF en les requalifiant";

  static override flags = {
    dryRun: Flags.boolean({ name: 'dryRun' }),
    identifiantProjet: Flags.string(),
  };

  async init() {
    Lauréat.registerLauréatUseCases({
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
    });

    Document.registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
    });
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(RattraperHistoriqueDocumentsCommand);

    // Maintenance
    // Variables : S3, DB

    const data = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          propositionTechniqueEtFinancière: {
            document: {
              format: Where.notEqualNull(),
            },
          },
          identifiantProjet: flags.identifiantProjet
            ? Where.equal(flags.identifiantProjet)
            : undefined,
        },
        range: {
          startPosition: 0,
          endPosition: 3000,
        },
      },
    );

    const documentQualifiés: {
      identifiantProjet: string;
      référence: string;
      type: 'convention-de-raccordement' | 'convention-de-raccordement-directe';
    }[] = [];

    const stats = {
      total: data.items.length,
      qualification: {
        cr: 0,
        crd: 0,
        ptf: 0,
        scans: 0,
        inconnu: 0,
        errors: [] as {
          identifiantProjet: string;
          référence: string;
          error: string;
        }[],
        fileNotFound: 0,
      },
      documentMigrés: {
        versCR: 0,
        versCRD: 0,
        errors: [] as {
          identifiantProjet: string;
          référence: string;
          error: string;
        }[],
      },
    };

    console.log(`Starting qualification for ${data.items.length} dossiers`);

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

        const stream = await download(document.formatter());
        const { type, text } = await getDocumentType(await streamToArrayBuffer(stream));

        if (
          type === 'convention-de-raccordement' ||
          type === 'convention-de-raccordement-directe'
        ) {
          console.log(`🔥 CR ou CRD trouvée`, {
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
          });
          documentQualifiés.push({
            référence: dossier.référence,
            identifiantProjet: dossier.identifiantProjet,
            type,
          });
          stats.qualification[type === 'convention-de-raccordement' ? 'cr' : 'crd']++;
        } else if (type === 'ptf') {
          console.log(`✨ PTF trouvée`, {
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
          });
          stats.qualification['ptf']++;
        } else if (!text || text.length < 5) {
          stats.qualification.scans++;
        } else {
          console.log('Type non trouvé', {
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
            text,
          });
          stats.qualification.inconnu++;
        }
      } catch (e) {
        if (e instanceof FichierInexistant) {
          console.log('Fichier inexistant', {
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
          });
          stats.qualification.fileNotFound++;
        } else {
          console.log(dossier, e);
          stats.qualification.errors.push({
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
            error: (e as Error).message,
          });
        }
      }
    }

    process.stdout.write(
      `\r⏳ ${stats.total} TOTAL / ${stats.qualification.ptf} PTF / ${stats.qualification.cr} CR / ${stats.qualification.crd} CRD / ${stats.qualification.scans} SCANS / ${stats.qualification.fileNotFound} FILE NOT FOUND / ${stats.qualification.errors.length} ERRORS`,
    );

    for (const document of documentQualifiés) {
      const now = DateTime.now().formatter();

      const event: Lauréat.Raccordement.TypeDocumentRaccordementModifiéEventV1 = {
        type: 'TypeDocumentRaccordementModifié-V1',
        payload: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(
            document.identifiantProjet,
          ).formatter(),
          référenceDossierRaccordement: document.référence,
          modifiéLe: now,
          modifiéPar: Email.système.email,
          ancienType: 'proposition-technique-et-financière',
          nouveauType: document.type,
        },
      };

      try {
        if (flags.dryRun) {
          console.log(`🙌 dryRun -- nouvel event`);
        } else {
          console.log(`🙌 Publication d'un événement pour ${document.identifiantProjet}`);

          await publish(`raccordement|${document.identifiantProjet}`, {
            ...event,
            created_at: now,
          });
        }

        if (document.type === 'convention-de-raccordement') {
          stats.documentMigrés.versCR++;
        } else {
          stats.documentMigrés.versCRD++;
        }
      } catch (e) {
        console.log(`⚠️ Erreur lors de la publication des événements : ${e}`, {
          référence: document.référence,
          identifiantProjet: document.identifiantProjet,
        });
        stats.documentMigrés.errors.push({
          identifiantProjet: document.identifiantProjet,
          référence: document.référence,
          error: (e as Error).message,
        });
      }
    }

    const outputPath = path.join(process.cwd(), 'erreurs_migration.json');
    fs.writeFileSync(outputPath, JSON.stringify(stats.documentMigrés.errors, null, 2), 'utf-8');

    process.stdout.write('\r');
    console.log('🔥--- Statistiques migration ---🔥');
    console.log(stats.documentMigrés);
    console.log(`⚠️ Fichier des erreurs généré : ${outputPath}`);
  }
}

// rebuild raccordement
// RESET Variables

async function getDocumentType(pdfUrl: Uint8Array) {
  const pdf = await getDocument({
    data: pdfUrl,
    verbosity: 0,
  }).promise;

  const allPages = [];
  for (let i = 1; i <= 2; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent({ disableNormalization: true });

    let text = content.items
      .map((s) => ('type' in s ? `${s.id}|${s.type}` : s.str))
      .join('')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    text = text.slice(0, text.indexOf('sommaire'));

    allPages.push(text);

    const isCRD = text.includes('convention de raccordement directe');
    const isCR = !isCRD && text.includes('convention de raccordement');
    const isPTF =
      text.includes('proposition technique et financiere') ||
      text.includes('proposition technique et financière');

    if ((isCRD || isCR) && isPTF) {
      return { type: 'unknown' as const, text: allPages.join('\n') };
    }

    if (isCRD) {
      return { type: 'convention-de-raccordement-directe' as const };
    }
    if (isCR) {
      return { type: 'convention-de-raccordement' as const };
    }
    if (isPTF) {
      return { type: 'ptf' as const };
    }
  }
  return { type: 'unknown' as const, text: allPages.join('\n') };
}

function concatArrayBuffers(chunks: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return concatArrayBuffers(chunks);
}

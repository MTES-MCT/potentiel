import { Command, Flags } from '@oclif/core';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { download, FichierInexistant } from '@potentiel-libraries/file-storage';

export class QualifierDocumentsCommand extends Command {
  static description = "Qualifie les documents PTF d'un raccordement";

  static flags = {
    projet: Flags.string({}),
    référence: Flags.string({}),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(QualifierDocumentsCommand);

    const data = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          propositionTechniqueEtFinancière: {
            propositionTechniqueEtFinancièreSignée: {
              format: Where.notEqualNull(),
            },
          },
          // identifiantProjet: Where.equal(flags.projet),
          identifiantProjet: Where.startWith('PPE2'),
          référence: Where.equal(flags.référence),
        },
        range: {
          startPosition: 0,
          endPosition: 100,
        },
      },
    );

    const stats = {
      total: data.items.length,
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
    };

    for (const dossier of data.items) {
      try {
        const document = Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière(
          {
            identifiantProjet: dossier.identifiantProjet,
            // biome-ignore lint/style/noNonNullAssertion: throwaway code
            dateSignature: dossier.propositionTechniqueEtFinancière!.dateSignature!,
            référenceDossierRaccordement: dossier.référence,
            propositionTechniqueEtFinancièreSignée:
              dossier.propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée,
          },
        );
        const stream = await download(document.formatter());
        const { type, text } = await getDocumentType(await streamToArrayBuffer(stream));

        if (type === 'cr') {
          console.log(`CR trouvé pour ${dossier.identifiantProjet} / ${dossier.référence}`, {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
          });
        }
        if (type !== 'unknown') {
          stats[type]++;
        } else if (text.length < 5) {
          stats.scans++;
        } else {
          process.stdout.write('\r');
          console.log('Type non trouvé', {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
            référence: dossier.référence,
            text,
          });
          stats.inconnu++;
        }
      } catch (e) {
        process.stdout.write('\r');
        if (e instanceof FichierInexistant) {
          console.log('Fichier inexistant', {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
            référence: dossier.référence,
          });
          stats.fileNotFound++;
        } else {
          console.log(dossier, e);
          stats.errors.push({
            identifiantProjet: dossier.identifiantProjet,
            référence: dossier.référence,
            error: (e as Error).message,
          });
        }
      }

      process.stdout.write(
        `\r⏳ ${stats.ptf} PTF / ${stats.cr} CR / ${stats.crd} CRD / ${stats.scans} SCANS / ${stats.fileNotFound} FILE NOT FOUND / ${stats.errors.length} ERRORS / ${stats.total} TOTAL`,
      );
    }

    process.stdout.write('\r');
    console.log(stats);
  }
}

async function getDocumentType(pdfUrl: Uint8Array) {
  var pdf = await getDocument({
    data: pdfUrl,
    verbosity: 0,
  }).promise;

  const allPages = [];
  for (let i = 1; i <= 2; i++) {
    const page = await pdf.getPage(i);
    // add page promise
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
    const isPTF = text.includes('proposition technique et financiere');

    if ((isCRD || isCR) && isPTF) {
      return { type: 'unknown' as const, text: allPages.join('\n') };
    }

    if (isCRD) {
      return { type: 'crd' as const };
    }
    if (isCR) {
      return { type: 'cr' as const };
    }
    if (isPTF) {
      return { type: 'ptf' as const };
    }
  }
  return { type: 'unknown' as const, text: allPages.join('\n') };
}

// https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
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

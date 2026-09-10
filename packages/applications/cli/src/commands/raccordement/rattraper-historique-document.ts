import { Command, Flags } from '@oclif/core';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

import type { DateTime, Email } from '@potentiel-domain/common';
import { Where } from '@potentiel-domain/entity';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { download, FichierInexistant } from '@potentiel-libraries/file-storage';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

export class RattraperHistoriqueDocumentsCommand extends Command {
  static description = "Rattraper l'historique des documents PTF en les requalifiant";

  static flags = {
    projet: Flags.string({}),
    référence: Flags.string({}),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(RattraperHistoriqueDocumentsCommand);

    const data = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
      `dossier-raccordement`,
      {
        where: {
          propositionTechniqueEtFinancière: {
            document: {
              format: Where.notEqualNull(),
            },
          },
          identifiantProjet: Where.startWith(flags.projet),
          référence: Where.equal(flags.référence),
          // '2026-07-27T13:57:06.740Z' est la date de la première transmission d'un nouveau type de document
          miseÀJourLe: Where.lessOrEqual('2026-07-27T13:57:06.739Z'),
        },
        range: {
          startPosition: 0,
          // env. 1900 documents concernés
          endPosition: 2500,
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
      },
    };

    console.log(`starting qualification for ${data.items.length} dossiers`);

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
          console.log(`CR trouvé pour ${dossier.identifiantProjet} / ${dossier.référence}`, {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
          });
          documentQualifiés.push({
            référence: dossier.référence,
            identifiantProjet: dossier.identifiantProjet,
            type,
          });
          stats.qualification[type === 'convention-de-raccordement' ? 'cr' : 'crd']++;
        }
        if (!text || text.length < 5) {
          stats.qualification.scans++;
        } else {
          process.stdout.write('\r');
          console.log('Type non trouvé', {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
            référence: dossier.référence,
            text,
          });
          stats.qualification.inconnu++;
        }
      } catch (e) {
        process.stdout.write('\r');
        if (e instanceof FichierInexistant) {
          console.log('Fichier inexistant', {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
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

      process.stdout.write(
        `\r⏳ ${stats.total} TOTAL / ${stats.qualification.cr} CR à traiter / ${stats.qualification.crd} CRD à traiter / ${stats.qualification.scans} SCANS / ${stats.qualification.fileNotFound} FILE NOT FOUND / ${stats.qualification.errors.length} ERRORS`,
      );

      for (const document of documentQualifiés) {
        // on exclue les stream pour lesquels il y a eu modification de la PTF
        // on a ensuite plusieurs règles de récupération des données en fonction des événements

        const data = await executeSelect<{
          identifiantProjet: IdentifiantProjet.RawType;
          référenceDossierRaccordement: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
          dateSignature: DateTime.RawType;
          format: string;
          transmisLe: DateTime.RawType;
          transmisPar: Email.RawType;
        }>(`
SELECT
  e.payload->>'référenceDossierRaccordement' AS référenceDossierRaccordement,
  e.payload->>'dateSignature' AS dateSignature,
  CASE
    WHEN e.type = 'PropositionTechniqueEtFinancièreTransmise-V1' THEN
      signed.payload->>'format'
    ELSE
      e.payload->>'format'
  END AS format,
  CASE
    WHEN e.type IN ('PropositionTechniqueEtFinancièreTransmise-V1', 'PropositionTechniqueEtFinancièreTransmise-V2') THEN
      e.convention-de-raccordementeated_at
    ELSE
      (e.payload->>'transmisLe')::timestamp
  END AS transmisLe,
  CASE
    WHEN e.type IN ('PropositionTechniqueEtFinancièreTransmise-V1', 'PropositionTechniqueEtFinancièreTransmise-V2') THEN
      'unknown-user@unknown-email.com'
    ELSE
      e.payload->>'transmisPar'
  END AS transmisPar,
  e.type
FROM event_store.event_stream e
LEFT JOIN event_store.event_stream signed
  ON signed.type = 'PropositionTechniqueEtFinancièreSignéeTransmise-V1'
  AND signed.payload->>'référenceDossierRaccordement' = e.payload->>'référenceDossierRaccordement'
WHERE
  e.stream_id = 'raccordement|' || $1
  AND e.payload->>'référenceDossierRaccordement' = $2
  AND e.type NOT LIKE 'PropositionTechniqueEtFinancièreModifié%'
  AND (
    e.type LIKE 'PropositionTechniqueEtFinancièreTransmise%'
    OR e.type LIKE 'PropositionTechniqueEtFinancièreSignéeTransmise%'
  )
  AND (
    e.type != 'PropositionTechniqueEtFinancièreTransmise-V1'
    OR signed.type IS NOT NULL
  );
  )
        `);

        if (!data) {
          console.log(`CR trouvé pour ${dossier.identifiantProjet} / ${dossier.référence}`, {
            projet: `https://potentiel.beta.gouv.fr/laureats/${encodeURIComponent(dossier.identifiantProjet)}/raccordements`,
          });
          continue;
        }

        const payload = {
          ...data,
          type: Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType(
            document.type,
          ).formatter(),
        };
      }

      // on ne traite pas les
      // si ce n'est pas une PTF, je regarde si y'a eu des events de modifications
      // si y'en a pas eu => go
      // faire un truc
    }

    // process.stdout.write(
    //   `\r⏳ ${stats.total} TOTAL / ${stats.ptf} PTF / ${stats.convention-de-raccordement} CR / ${stats.convention-de-raccordement-directe} CRD / ${stats.scans} SCANS / ${stats.fileNotFound} FILE NOT FOUND / ${stats.errors.length} ERRORS`,
    // );
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

import { readdir, writeFile, readFile } from 'node:fs/promises';
import { join, basename, extname } from 'path';

import { encode, decode } from 'iconv-lite';
import chardet from 'chardet';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import {
  ProjetAdapter,
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Période } from '@potentiel-domain/periode';

export const dgecEmail = 'aopv.dgec@developpement-durable.gouv.fr';

[
  'DIRECTORY_PATH',
  'DATABASE_CONNECTION_STRING',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'S3_ENDPOINT',
  'S3_BUCKET',
].forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`La variable d'environnement ${varName} n'est pas définie.`);
    process.exit(1);
  }
});

Période.registerPériodeQueries({
  find: findProjection,
  list: listProjection,
});

Candidature.registerCandidatureQueries({
  find: findProjection,
  list: listProjection,
  récupérerProjetsEligiblesPreuveRecanditure:
    ProjetAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
});

GarantiesFinancières.registerGarantiesFinancièresQueries({
  find: findProjection,
  list: listProjection,
  récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
});

registerDocumentProjetCommand({
  enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
  déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
  archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
});

registerDocumentProjetQueries({
  récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
});

const formatFileName = (id: string) =>
  id
    .replace(/PPE2 - Autoconsommation métrople/, 'PPE2 - Autoconsommation métropole')
    .replace(/PPE2 - Innovant/, 'PPE2 - Innovation')
    .replace(/PPE2 - Bâtiment/, 'PPE2 - Bâtiment');

const detectAndConvertEncoding = (fileName: string) => {
  const detectedEncoding = chardet.detect(Buffer.from(fileName));
  if (!detectedEncoding) {
    throw new Error("Impossible de détecter l'encodage");
  }
  const buffer = encode(fileName, detectedEncoding);
  const decodedStr = decode(buffer, 'utf-8');

  return decodedStr;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

void (async () => {
  const directoryPath = process.env.DIRECTORY_PATH!;
  const dirrents = await readdir(directoryPath, {
    withFileTypes: true,
  });

  type Statistics = {
    fichiersNonCompatibles: {
      count: number;
      content: Array<string>;
    };
    projetInconnu: {
      count: number;
      content: Array<string>;
    };
    attestationAjoutée: {
      count: number;
      content: Array<string>;
    };
    gfCréeEtAttestationAjoutée: {
      count: number;
      content: Array<string>;
    };
    attestationExistante: {
      count: number;
      content: Array<string>;
    };
    errors: {
      count: number;
      content: Array<string>;
    };
  };

  const statistics: Statistics = {
    fichiersNonCompatibles: {
      count: 0,
      content: [],
    },
    projetInconnu: {
      count: 0,
      content: [],
    },
    attestationAjoutée: {
      count: 0,
      content: [],
    },
    gfCréeEtAttestationAjoutée: {
      count: 0,
      content: [],
    },
    attestationExistante: {
      count: 0,
      content: [],
    },
    errors: {
      count: 0,
      content: [],
    },
  };

  const format = 'application/pdf';
  const { items: périodes } = await mediator.send<Période.ListerPériodesQuery>({
    type: 'Période.Query.ListerPériodes',
    data: {},
  });

  for (const file of dirrents) {
    try {
      if (!file.isFile() || extname(file.name).toLowerCase() !== '.pdf') {
        statistics.fichiersNonCompatibles.count++;
        statistics.fichiersNonCompatibles.content.push(file.name);
        continue;
      }

      const formattedFileName = formatFileName(
        basename(detectAndConvertEncoding(file.name), '.pdf'),
      );

      console.log(`\n\n${formattedFileName}`);

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(formattedFileName);

      const projet = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      /**
       * Si le projet n'est pas trouvé, on skip
       */
      if (Option.isNone(projet)) {
        statistics.projetInconnu.count++;
        statistics.projetInconnu.content.push(identifiantProjet.formatter());
        continue;
      }

      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const filePath = join(directoryPath, file.name);
      const fileBuffer = await readFile(filePath);
      const content = new ReadableStream({
        start: async (controller) => {
          controller.enqueue(fileBuffer);
          controller.close();
        },
      });
      const enregistréParValue = Email.convertirEnValueType(dgecEmail).formatter();

      if (Option.isSome(gf)) {
        if (gf.garantiesFinancières.attestation) {
          statistics.attestationExistante.count++;
          statistics.attestationExistante.content.push(identifiantProjet.formatter());
          continue;
        }

        const dateConstitutionValue = DateTime.convertirEnValueType(
          gf.garantiesFinancières.dateConstitution?.formatter() ?? DateTime.now().formatter(),
        ).formatter();

        await mediator.send<Lauréat.GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>(
          {
            type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              dateConstitutionValue,
              attestationValue: {
                content,
                format,
              },
              enregistréLeValue: DateTime.now().formatter(),
              enregistréParValue,
            },
          },
        );
        statistics.attestationAjoutée.count++;
        statistics.attestationAjoutée.content.push(identifiantProjet.formatter());
        continue;
      }

      const période = périodes.find(
        (période) =>
          période.identifiantPériode.appelOffre === identifiantProjet.appelOffre &&
          période.identifiantPériode.période === identifiantProjet.période,
      );

      if (!période) {
        statistics.errors.content.push(
          `❌ ${identifiantProjet.formatter()} (${projet.nomProjet}) : Période non trouvée`,
        );
        continue;
      }

      if (!période.estNotifiée || !période.notifiéeLe) {
        statistics.errors.content.push(
          `❌ ${identifiantProjet.formatter()} (${projet.nomProjet}) : Période non notifiée`,
        );
        continue;
      }

      await mediator.send<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          garantiesFinancièresValue: {
            type: Candidature.TypeGarantiesFinancières.typeInconnu.type,
          },
          dateConstitutionValue: période.notifiéeLe.formatter(),
          attestationValue: {
            content,
            format: 'application/pdf',
          },
          enregistréLeValue: DateTime.now().formatter(),
          enregistréParValue,
        },
      });

      statistics.gfCréeEtAttestationAjoutée.count++;
      statistics.gfCréeEtAttestationAjoutée.content.push(identifiantProjet.formatter());

      await delay(50);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  console.log('\n\nStatistiques :');
  console.log(
    `📂 Nombre de fichiers traités : ${statistics.attestationAjoutée.count + statistics.attestationExistante.count + statistics.fichiersNonCompatibles.count + statistics.gfCréeEtAttestationAjoutée.count + statistics.projetInconnu.count}/${dirrents.length}`,
  );

  console.log(`❌ Nombre de fichiers non compatibles : ${statistics.fichiersNonCompatibles.count}`);
  console.log(`❓ Nombre de projets inconnu dans potentiel : ${statistics.projetInconnu.count}`);
  console.log(
    `ℹ️ Nombre d'attestations déjà existantes : ${statistics.attestationExistante.count}`,
  );

  console.log(
    `📝 Nombre d'attestations ajoutées à des gfs existantes : ${statistics.attestationAjoutée.count}`,
  );
  console.log(
    `🍀 Nombre de gf créées avec attestation : ${statistics.gfCréeEtAttestationAjoutée.count}`,
  );

  for (const [key, { content }] of Object.entries(statistics)) {
    if (content.length) {
      await writeFile(`src/garanties-financières/logs/${key}.txt`, content.join('\n'));
    }
  }

  process.exit(0);
})();

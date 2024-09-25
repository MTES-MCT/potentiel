import { readdir, writeFile, readFile } from 'node:fs/promises';
import path from 'path';

import { encode, decode } from 'iconv-lite';
import chardet from 'chardet';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import {
  CandidatureAdapter,
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';

[
  'DIRECTORY_PATH',
  'EVENT_STORE_CONNECTION_STRING',
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
  récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
  récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  récupérerProjetsEligiblesPreuveRecanditure:
    CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
});

GarantiesFinancières.registerGarantiesFinancièresUseCases({
  loadAggregate,
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
    .replace(/PPE2 - Bâtiment/, 'PPE2 - Bâtiment'); // Je comprends pas pourquoi je suis obligé de faire ça

const detectAndConvertEncoding = (fileName: string) => {
  // Détecter l'encodage de la chaîne
  const detectedEncoding = chardet.detect(Buffer.from(fileName));

  if (!detectedEncoding) {
    throw new Error("Impossible de détecter l'encodage");
  }

  // Convertir la chaîne en utf-8
  const buffer = encode(fileName, detectedEncoding);
  const decodedStr = decode(buffer, 'utf-8');

  return decodedStr;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const directoryPath = process.env.DIRECTORY_PATH!;
  const dirrents = await readdir(directoryPath, {
    withFileTypes: true,
  });

  type Statistics = {
    projetInconnu: {
      count: number;
      ids: Array<string>;
    };
    attestationAjoutée: number;
    gfCréeEtAttestationAjoutée: number;
    attestationExistante: number;
  };
  const statistics: Statistics = {
    projetInconnu: {
      count: 0,
      ids: [],
    },
    attestationAjoutée: 0,
    gfCréeEtAttestationAjoutée: 0,
    attestationExistante: 0,
  };

  const format = 'application/pdf';
  const { items: périodes } = await mediator.send<Période.ListerPériodesQuery>({
    type: 'Période.Query.ListerPériodes',
    data: {},
  });

  for (const file of dirrents) {
    try {
      await delay(50);

      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.pdf') {
        console.log(`❌ Fichier ${file.name} non pris en charge`);
        continue;
      }

      const formattedFileName = formatFileName(
        path.basename(detectAndConvertEncoding(file.name), '.pdf'),
      );

      console.log(`\n\n📂 ${formattedFileName}`);

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(formattedFileName);

      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(projet)) {
        console.log(`❌ ${identifiantProjet.formatter()} : Projet inconnu`);
        statistics.projetInconnu.count++;
        statistics.projetInconnu.ids.push(identifiantProjet.formatter());
        continue;
      }

      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const filePath = path.join(directoryPath, file.name);
      const fileBuffer = await readFile(filePath);
      const content = new ReadableStream({
        start: async (controller) => {
          controller.enqueue(fileBuffer);
          controller.close();
        },
      });
      const enregistréParValue = Email.convertirEnValueType(
        'aopv.dgec@developpement-durable.gouv.fr',
      ).formatter();

      if (Option.isSome(gf)) {
        if (gf.garantiesFinancières.attestation) {
          console.log(
            `ℹ️ ${identifiantProjet.formatter()} (${projet.nom}) : Le projet a déjà une attestation`,
          );
          statistics.attestationExistante++;
          continue;
        }

        const dateConstitutionValue = DateTime.convertirEnValueType(
          gf.garantiesFinancières.dateConstitution?.formatter() ?? DateTime.now().formatter(),
        ).formatter();

        await mediator.send<GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>(
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
        statistics.attestationAjoutée++;
        console.log(
          `📝 ${identifiantProjet.formatter()} (${projet.nom}) : Attestation ajoutée aux garanties financières existante`,
        );
        continue;
      }

      const période = périodes.find(
        (période) =>
          période.identifiantPériode.appelOffre === identifiantProjet.appelOffre &&
          période.identifiantPériode.période === identifiantProjet.période,
      );

      if (!période) {
        console.log(`❌ ${identifiantProjet.formatter()} (${projet.nom}) : Période non trouvée`);
        continue;
      }

      if (!période.estNotifiée || !période.notifiéeLe) {
        console.log(`❌ ${identifiantProjet.formatter()} (${projet.nom}) : Période non notifiée`);
        continue;
      }

      await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: Candidature.TypeGarantiesFinancières.typeInconnu.type,
          dateConstitutionValue: période.notifiéeLe.formatter(),
          attestationValue: {
            content,
            format: 'application/pdf',
          },
          enregistréLeValue: DateTime.now().formatter(),
          enregistréParValue,
        },
      });

      statistics.gfCréeEtAttestationAjoutée++;
      console.log(
        `🍀 ${identifiantProjet.formatter()} (${projet.nom}) : Garanties financières créée avec l'attestation`,
      );
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  console.log('\n\nStatistiques :');
  console.log(`Nombre de projets concernés : ${dirrents.length}`);
  console.log(
    `Nombre de projets inconnu dans potentiel : ${statistics.projetInconnu.count} / ${dirrents.length}`,
  );
  console.log(
    `Nombre d'attestation ajoutées à des gfs existante : ${statistics.attestationAjoutée} / ${dirrents.length}`,
  );
  console.log(
    `Nombre de gf crées avec attestation : ${statistics.gfCréeEtAttestationAjoutée} / ${dirrents.length}`,
  );
  console.log(
    `Nombre d'attestation déjà existante : ${statistics.attestationExistante} / ${dirrents.length}`,
  );

  if (statistics.projetInconnu.ids.length) {
    await writeFile('projets-non-trouvés.txt', statistics.projetInconnu.ids.join('\n'));
  }

  process.exit(0);
})();

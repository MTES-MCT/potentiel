import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'path';

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
import { CandidatureAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Candidature } from '@potentiel-domain/candidature';

if (!process.env.DIRECTORY_PATH) {
  console.error(`La variable d'environnement DIRECTORY_PATH n'est pas définie.`);
  process.exit(1);
}

if (!process.env.EVENT_STORE_CONNECTION_STRING) {
  console.error(`La variable d'environnement EVENT_STORE_CONNECTION_STRING n'est pas définie.`);
  process.exit(1);
}

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
});

registerDocumentProjetCommand({
  enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
  déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
  archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
});

registerDocumentProjetQueries({
  récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
});

const formatProjetId = (id: string) =>
  id
    .replace(/^PPE2 - Autoconsommation m.trople#/, 'PPE2 - Autoconsommation métropole#')
    .replace('PPE2 - Innovant', 'PPE2 - Innovation')
    .replace(/^PPE2 - B.timent#/, 'PPE2 - Bâtiment#');

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

  for (const file of dirrents) {
    try {
      await delay(100);

      if (!file.isFile() || path.extname(file.name).toLowerCase() !== '.pdf') {
        console.log(`❌ Fichier ${file.name} non pris en charge`);
        continue;
      }

      const fileName = path.basename(file.name, '.pdf');

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        formatProjetId(fileName),
      ).formatter();

      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: {
          identifiantProjet,
        },
      });

      if (Option.isNone(projet)) {
        console.log(`❌ ${identifiantProjet} : Projet inconnu`);
        statistics.projetInconnu.count++;
        statistics.projetInconnu.ids.push(identifiantProjet);
        continue;
      }

      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
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
        'contact@potentiel.beta.gouv.fr',
      ).formatter();

      if (Option.isSome(gf)) {
        if (gf.garantiesFinancières.attestation) {
          console.log(`ℹ️ ${identifiantProjet} (${projet.nom}) : Le projet a déjà une attestation`);
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
              identifiantProjetValue: identifiantProjet,
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
          `📝 ${identifiantProjet} (${projet.nom}) : Attestation ajoutée aux garanties financières existante`,
        );
        continue;
      }

      await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet,
          typeValue: Candidature.TypeGarantiesFinancières.typeInconnu.type,
          dateConstitutionValue: DateTime.now().formatter(), // Quelle date mettre ici ?
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
        `📝 ${identifiantProjet} (${projet.nom}) : Garanties financières créée avec l'attestation`,
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

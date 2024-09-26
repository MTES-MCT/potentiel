import { extname, join } from 'node:path';
import { readFile } from 'node:fs/promises';

import { mediator } from 'mediateur';
import { contentType } from 'mime-types';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Recours } from '@potentiel-domain/elimine';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Candidature } from '@potentiel-domain/candidature';
import { download } from '@potentiel-libraries/file-storage';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { CandidatureAdapter, DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { registerDocumentProjetCommand } from '@potentiel-domain/document';

import { dgecEmail } from '../_utils/constant';

Candidature.registerCandidatureQueries({
  find: findProjection,
  list: listProjection,
  récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
  récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  récupérerProjetsEligiblesPreuveRecanditure:
    CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
});

Recours.registerRecoursUseCases({
  loadAggregate: loadAggregate,
});

registerDocumentProjetCommand({
  archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
  déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
  enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
});

export const mapToReadableStream = async (buffer: Buffer): Promise<ReadableStream> => {
  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buffer);
      controller.close();
    },
  });
};

const getFile = async (
  fileId: string | undefined,
): Promise<{
  format: string;
  content: ReadableStream;
}> => {
  if (!fileId) {
    const content = await mapToReadableStream(
      await readFile(join(__dirname, '..', '..', 'blank.pdf')),
    );

    return {
      format: 'application/pdf',
      content,
    };
  }

  const result = await executeSelect<{
    storedAt: string;
  }>(
    `
    select "storedAt" from "files" where "id" = $1
  `,
    fileId,
  );

  const storedAt = result[0].storedAt;

  const format = contentType(extname(storedAt));

  if (!format) {
    throw new Error('Format inconnu');
  }

  return {
    format,
    content: await download(
      storedAt.replace('S3:potentiel-production:', '').replace('S3:production-potentiel:', ''),
    ),
  };
};

const getUtilisateur = async (utilisateurId: string): Promise<string> => {
  const result = await executeSelect<{
    email: string;
  }>(
    `
    select email from "users" where "id" = $1 
  `,
    utilisateurId,
  );
  return result[0].email;
};

(async () => {
  console.log('Recours migrations');
  console.log('Retrieve Recours ModificationRequests');

  const modificationRequests = await executeSelect<{
    id: string;
    appelOffreId: string;
    periodeId: string;
    familleId?: string;
    numeroCRE: string;
    status: 'acceptée' | 'envoyée' | 'rejetée' | 'annulée' | 'en instruction';
    justification: string;
    createdAt: string;
    fileId?: string;
    updatedAt: string;
    respondedBy?: string;
    responseFileId?: string;
    nomProjet: string;
  }>(`
      select 
        p.id,
        p."appelOffreId", 
        p."periodeId", 
        p."familleId", 
        p."numeroCRE",
        p."nomProjet",
        m."status", 
        m."justification", 
        m."createdAt", 
        m."fileId", 
        m."updatedAt", 
        m."respondedBy", 
        m."responseFileId",
        m."isLegacy"
      from "modificationRequests" as m
      inner join "projects" as p on p.id = m."projectId"
      where m.type = 'recours'
    `);

  console.log(`${modificationRequests.length} Recours ModificationRequests`);
  const errors: Array<{
    identifiantProjet: string;
    legacyId: string;
    error: Error;
    nomProjet: string;
  }> = [];

  for (const {
    id,
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
    status,
    createdAt,
    updatedAt,
    justification,
    respondedBy,
    fileId,
    responseFileId,
    nomProjet,
  } of modificationRequests) {
    if (
      id === '694f1be2-0eb2-44e3-836f-681eea24b25b' ||
      (id === 'c58214c3-8697-4a84-9e29-4e8e8eda1466' && status === 'envoyée')
    ) {
      console.log('-----------------------------------------');
      console.log('Skip projets avec incohérence de données');
      console.log(`Legacy ID          : ${id}`);
      console.log('-----------------------------------------');
    } else {
      const identifiantProjet = IdentifiantProjet.bind({
        appelOffre: appelOffreId,
        période: periodeId,
        famille: familleId ?? '',
        numéroCRE: numeroCRE,
      });

      try {
        console.log('-----------------------------------------');
        console.log(`Legacy ID          : ${id}`);
        console.log(`Identifiant Projet : ${identifiantProjet.formatter()}`);

        const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
          type: 'Candidature.Query.ConsulterProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

        if (Option.isNone(projet)) {
          throw new Error('Unknown project');
        }

        console.log(`Création demande recours`);
        await mediator.send<Recours.RecoursUseCase>({
          type: 'Éliminé.Recours.UseCase.DemanderRecours',
          data: {
            dateDemandeValue: new Date(createdAt).toISOString(),
            identifiantProjetValue: identifiantProjet.formatter(),
            identifiantUtilisateurValue: projet.candidat.contact,
            pièceJustificativeValue: await getFile(fileId),
            raisonValue: justification,
          },
        });

        switch (status) {
          case 'annulée':
            console.log(`Création annulation recours`);
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.AnnulerRecours',
              data: {
                dateAnnulationValue: new Date(updatedAt).toISOString(),
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: projet.candidat.contact,
              },
            });
            break;
          case 'acceptée':
            console.log(`Création accord recours`);
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.AccorderRecours',
              data: {
                dateAccordValue: new Date(updatedAt).toISOString(),
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: respondedBy
                  ? await getUtilisateur(respondedBy)
                  : dgecEmail,
                réponseSignéeValue: await getFile(responseFileId),
              },
            });
            break;
          case 'rejetée':
            console.log(`Création rejet recours`);
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.RejeterRecours',
              data: {
                dateRejetValue: new Date(updatedAt).toISOString(),
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: respondedBy
                  ? await getUtilisateur(respondedBy)
                  : dgecEmail,
                réponseSignéeValue: await getFile(responseFileId),
              },
            });
            break;
        }
      } catch (e) {
        console.error(e);
        errors.push({
          nomProjet,
          error: e as Error,
          legacyId: id,
          identifiantProjet: identifiantProjet.formatter(),
        });
      } finally {
        console.log('-----------------------------------------');
      }
    }
  }

  try {
    console.log('-----------------------------------------');
    console.log('Ajout recours avec données incohérente : ?');
    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.DemanderRecours',
      data: {
        dateDemandeValue: '?',
        identifiantProjetValue: '?',
        identifiantUtilisateurValue: '?',
        pièceJustificativeValue: await getFile('b2fc66a7-50de-4d78-a67f-dc79f02873b6'),
        raisonValue: `?`,
      },
    });
    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AccorderRecours',
      data: {
        dateAccordValue: '?',
        identifiantProjetValue: '?',
        identifiantUtilisateurValue: '?',
        réponseSignéeValue: await getFile('01582ed9-b06b-4821-9aaf-d9cc6282778d'),
      },
    });
  } catch (e) {
    console.error(e);
    errors.push({
      nomProjet: '?',
      error: e as Error,
      legacyId: '694f1be2-0eb2-44e3-836f-681eea24b25b',
      identifiantProjet: '?',
    });
  } finally {
    console.log('-----------------------------------------');
  }

  if (errors.length) {
    const errorSet = new Set(errors.map((e) => e.error.message));

    for (const message of errorSet) {
      console.log(
        `${errors.filter((e) => e.error.message === message && !['ea576960-a026-11ea-b05c-11293d839ea9', '829b11dd-048f-47ae-9260-a89452ff6f85', '166e22d3-c74d-49f7-af85-45e54c8f3d4a'].includes(e.legacyId)).length} erreur(s) -> ${message}`,
      );
    }

    console.log(`Rapport d'erreur`);
    for (const error of errors) {
      if (
        ![
          'ea576960-a026-11ea-b05c-11293d839ea9',
          '829b11dd-048f-47ae-9260-a89452ff6f85',
          '166e22d3-c74d-49f7-af85-45e54c8f3d4a',
        ].includes(error.legacyId)
      ) {
        console.log('******************************************');
        console.log(`Nom                : ${error.nomProjet}`);
        console.log(`Legacy ID          : ${error.legacyId}`);
        console.log(`Identifiant Projet : ${error.identifiantProjet}`);
        console.error(error.error);
        console.log('******************************************');
      }
    }

    if (
      errors.filter(
        (e) =>
          ![
            'ea576960-a026-11ea-b05c-11293d839ea9',
            '829b11dd-048f-47ae-9260-a89452ff6f85',
            '166e22d3-c74d-49f7-af85-45e54c8f3d4a',
          ].includes(e.legacyId),
      ).length
    ) {
      process.exit(1);
    }
  }

  process.exit(0);
})();

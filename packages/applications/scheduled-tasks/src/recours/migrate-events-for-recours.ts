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

export const mapToReadableStream = async (buffer: Buffer): Promise<ReadableStream> => {
  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buffer);
      controller.close();
    },
  });
};

const getPièceJustificative = async (
  fileId: string | undefined,
): Promise<{
  format: string;
  content: ReadableStream;
}> => {
  if (!fileId) {
    const content = await mapToReadableStream(await readFile(join('..', '..', 'blank.pdf')));

    return {
      format: 'application/pdf',
      content,
    };
  } else {
    return await getFile(fileId);
  }
};

const getFile = async (
  fileId: string,
): Promise<{
  format: string;
  content: ReadableStream;
}> => {
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

  const content = await download(storedAt.replace('S3:potentiel-production:projects/', ''));

  return {
    format,
    content,
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
  try {
    console.log('Start Recours migrations');
    console.log('-----------------------------------------');
    console.log('Retrieve Recours ModificationRequests');

    const modificationRequests = await executeSelect<{
      appelOffreId: string;
      periodeId: string;
      familleId?: string;
      numeroCRE: string;
      status: 'acceptée' | 'envoyée' | 'rejetée' | 'annulée' | 'en instruction';
      justification: string;
      createdAt: string;
      fileId?: string;
      updatedAt: string;
      respondedBy: string;
      responseFileId?: string;
    }>(`
      select 
        p."appelOffreId", 
        p."periodeId", 
        p."familleId", 
        p."numeroCRE", 
        "status", 
        "justification", 
        m."createdAt", 
        m."fileId", 
        m."updatedAt", 
        "respondedBy", 
        m."responseFileId"
      from "modificationRequests" as m
      inner join "projects" as p on p.id = m."projectId"
      where type = 'recours';
    `);

    for (const {
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
    } of modificationRequests) {
      const identifiantProjet = IdentifiantProjet.bind({
        appelOffre: appelOffreId,
        période: periodeId,
        famille: familleId ?? '',
        numéroCRE: numeroCRE,
      });

      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(projet)) {
        console.log('Error: Unknown project');
      } else {
        await mediator.send<Recours.RecoursUseCase>({
          type: 'Éliminé.Recours.UseCase.DemanderRecours',
          data: {
            dateDemandeValue: createdAt,
            identifiantProjetValue: identifiantProjet.formatter(),
            identifiantUtilisateurValue: projet.candidat.contact,
            pièceJustificativeValue: await getPièceJustificative(fileId),
            raisonValue: justification,
          },
        });

        switch (status) {
          case 'annulée':
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.AnnulerRecours',
              data: {
                dateAnnulationValue: updatedAt,
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: projet.candidat.contact,
              },
            });
            break;
          case 'acceptée':
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.AccorderRecours',
              data: {
                dateAccordValue: updatedAt,
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: await getUtilisateur(respondedBy),
                réponseSignéeValue: await getFile(responseFileId ?? ''),
              },
            });
            break;
          case 'rejetée':
            await mediator.send<Recours.RecoursUseCase>({
              type: 'Éliminé.Recours.UseCase.RejeterRecours',
              data: {
                dateRejetValue: updatedAt,
                identifiantProjetValue: identifiantProjet.formatter(),
                identifiantUtilisateurValue: await getUtilisateur(respondedBy),
                réponseSignéeValue: await getFile(responseFileId ?? ''),
              },
            });
            break;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  process.exit(0);
})();

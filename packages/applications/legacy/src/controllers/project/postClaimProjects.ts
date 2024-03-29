import routes from '../../routes';
import { v1Router } from '../v1Router';
import { claimProject, ensureRole } from '../../config';
import asyncHandler from '../helpers/asyncHandler';
import { createReadStream } from 'fs';
import { upload } from '../upload';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { errorResponse } from '../helpers';
import { addQueryParams } from '../../helpers/addQueryParams';

v1Router.post(
  routes.USER_CLAIM_PROJECTS,
  ensureRole('porteur-projet'),
  upload.multiple(),
  asyncHandler(async (request, response) => {
    const { projectIds } = request.body;
    const { user, files } = request;

    const projectsIdsArr = projectIds.split(',');

    if (!projectsIdsArr.every((projectId) => validateUniqueId(projectId))) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      });
    }

    const params = convertBodyParamsToFormattedJSON(request.body, projectsIdsArr, files);

    try {
      const projectsClaimedPromises = await Promise.allSettled(
        projectsIdsArr.map(async (projectId) => {
          const projectParams = params.find((param) => param.projectId === projectId);
          if (!projectParams) return;

          return await claimProject({
            projectId,
            prix: Number(projectParams.prix?.trim()),
            numeroCRE: projectParams.numeroCRE?.trim(),
            claimedBy: user,
            attestationDesignationProofFile: projectParams.attestationDesignationFile,
          });
        }),
      );

      const errors: string[] = [];
      const successes: string[] = [];

      projectsClaimedPromises.map((promise) => {
        if (promise.status === 'fulfilled') {
          if (promise.value?.isErr()) {
            // @ts-ignore
            errors.push(promise.value.error);
          }

          promise.value?.map((projectName: string) => successes.push(projectName));
        }
      });

      const successMessages = successes.length
        ? `Les projets suivants ont été ajoutés à l'onglet 'Mes projets' :\n${successes.join('\n')}`
        : undefined;

      if (errors.length) {
        const errorMessages = `Les projets suivants n'ont pas pu être ajoutés.\n${errors.join(
          '\n',
        )}`;

        return response.redirect(
          addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, {
            error: errorMessages,
          }),
        );
      }

      return response.redirect(
        addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, {
          success: successMessages,
        }),
      );
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, {
          error: error.message,
        }),
      );
    }
  }),
);

function convertBodyParamsToFormattedJSON(body, projectIds: string[], files?) {
  const bodyKeys = Object.keys(body).filter((param) => param !== 'projectIds');

  return projectIds.reduce((acc, projectId) => {
    const projectDataFields: any = bodyKeys
      .filter((key) => key.includes(projectId))
      .reduce(
        (acc, curr) => {
          const propName = curr.split('|')[0];
          const propValue = body[curr];

          return { ...acc, [propName]: propValue };
        },
        { projectId },
      );

    const attestationDesignationFile = files?.find((file) => {
      const [propName, projId] = file.fieldname.split('|');
      return propName === 'attestation-designation' && projId === projectId;
    });

    if (attestationDesignationFile) {
      projectDataFields.attestationDesignationFile = {
        contents: createReadStream(attestationDesignationFile.path),
        filename: attestationDesignationFile.originalname,
      };
    }

    return [...acc, projectDataFields];
  }, []) as any;
}

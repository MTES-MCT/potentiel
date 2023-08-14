import { ensureRole, eventStore, fileRepo } from '@config';
import { logger } from '@core/utils';
import { createReadStream } from 'fs';
import { UniqueEntityID } from '../../core/domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { makeFileObject } from '../../modules/file';
import { FileAttachedToProject, FileAttachedToProjectPayload } from '../../modules/file/events';
import routes from '@routes';
import { iso8601DateToDateYupTransformation } from '../helpers';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';

const schema = yup.object({
  body: yup.object({
    projectId: yup
      .string()
      .uuid()
      .required(
        `Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.`,
      ),
    title: yup.string().required(`Vous devez renseigner un titre.`),
    date: yup
      .date()
      .required(`Vous devez renseigner une date.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date est au mauvais format.`),
    description: yup.string().optional(),
  }),
});

v1Router.post(
  routes.ATTACHER_FICHIER_AU_PROJET_ACTION,
  upload.multiple(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
            error: `${error.errors.join(' ')}`,
            ...request.body,
          }),
        ),
    },
    async (request, response) => {
      const { projectId, date, title, description } = request.body;

      if (!request.files || !request.files.length) {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: "Merci d'attacher un fichier.",
            ...request.body,
          }),
        );
      }

      const uploadedFiles: FileAttachedToProjectPayload['files'] = [];

      // @ts-ignore
      for (const file of request.files) {
        const fileResult = await makeFileObject({
          designation: 'fichier-attaché-au-projet',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(request.user.id),
          filename: file.originalname,
          contents: createReadStream(file.path),
        }).asyncAndThen((file) => {
          uploadedFiles.push({ id: file.id.toString(), name: file.filename });
          return fileRepo.save(file);
        });

        if (fileResult.isErr()) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: "Echec de l'envoi du fichier.",
              ...request.body,
            }),
          );
        }
      }

      return eventStore
        .publish(
          new FileAttachedToProject({
            payload: {
              projectId,
              title,
              description,
              files: uploadedFiles,
              attachedBy: request.user.id,
              date: date.getTime(),
            },
          }),
        )
        .match(
          () => {
            response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: 'Les fichiers ont bien été attachés au projet.',
                redirectUrl: routes.PROJECT_DETAILS(projectId),
                redirectTitle: 'Retourner à la page projet',
              }),
            );
          },
          (e) => {
            logger.error(e as Error);

            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                error: "Votre demande n'a pas pu être prise en compte.",
                ...request.body,
              }),
            );
          },
        );
    },
  ),
);

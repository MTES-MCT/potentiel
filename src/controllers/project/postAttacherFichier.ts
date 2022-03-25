import { ensureRole, eventStore, fileRepo } from '@config'
import { logger } from '@core/utils'
import { createReadStream } from 'fs'
import moment from 'moment-timezone'
import { UniqueEntityID } from '../../core/domain'
import { addQueryParams } from '../../helpers/addQueryParams'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { makeFileObject } from '../../modules/file'
import { FileAttachedToProject, FileAttachedToProjectPayload } from '../../modules/file/events'
import routes from '../../routes'
import { errorResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ATTACHER_FICHIER_AU_PROJET_ACTION,
  upload.multiple(),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId, stepDate, title, description, file } = request.body

    console.log('attacher fichier', request.body)

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    if (!stepDate || !stepDate.length) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: 'Merci de renseigner une date.',
          ...request.body,
        })
      )
    }

    if (stepDate && moment(stepDate, FORMAT_DATE).format(FORMAT_DATE) !== stepDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: 'La date est au mauvais format.',
          ...request.body,
        })
      )
    }

    if (!title || !title.length) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: 'Merci de renseigner un titre.',
          ...request.body,
        })
      )
    }

    if (!request.files || !request.files.length) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: "Merci d'attacher un fichier.",
          ...request.body,
        })
      )
    }

    const uploadedFiles: FileAttachedToProjectPayload['files'] = []

    // @ts-ignore
    for (const file of request.files) {
      const fileResult = await makeFileObject({
        designation: 'fichier-attaché-au-projet',
        forProject: new UniqueEntityID(projectId),
        createdBy: new UniqueEntityID(request.user.id),
        filename: file.originalname,
        contents: createReadStream(file.path),
      }).andThen((file): any => {
        uploadedFiles.push({ id: file.id.toString(), name: file.filename })
        return fileRepo.save(file)
      })

      if (fileResult.isErr()) {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: "Echec de l'envoi du fichier.",
            ...request.body,
          })
        )
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
            date: moment(stepDate, FORMAT_DATE).toDate().getTime(),
          },
        })
      )
      .match(
        () => {
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success:
                request.files?.length && request.files?.length > 1
                  ? 'Les fichiers ont bien été attachés au projet.'
                  : 'Le fichier a bien été attaché au projet.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (e) => {
          logger.error(e as Error)

          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: "Votre demande n'a pas pu être prise en compte.",
              ...request.body,
            })
          )
        }
      )
  })
)

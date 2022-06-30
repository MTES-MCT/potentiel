import { ensureRole, eventStore, fileRepo } from '@config'
import { ImporterListingEDFPage } from '@views'
import { createReadStream } from 'fs'
import { UniqueEntityID } from '../core/domain'
import { logger } from '../core/utils'
import { addQueryParams } from '../helpers/addQueryParams'
import { ListingEDFImporté } from '../modules/edf'
import { makeFileObject } from '../modules/file'
import routes from '@routes'
import asyncHandler from './helpers/asyncHandler'
import { upload } from './upload'
import { v1Router } from './v1Router'

v1Router.get(
  routes.IMPORTER_LISTING_EDF,
  ensureRole(['acheteur-obligé']),
  asyncHandler(async (request, response) => {
    return response.send(ImporterListingEDFPage({ request }))
  })
)

v1Router.post(
  routes.IMPORTER_LISTING_EDF,
  ensureRole(['acheteur-obligé']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    if (!request.file) {
      return response.redirect(
        addQueryParams(routes.IMPORTER_LISTING_EDF, {
          error: 'Merci de sélectionner un fichier.',
          ...request.body,
        })
      )
    }

    // TODO: persist file, emit event
    const contents = createReadStream(request.file!.path)
    const filename = `${Date.now()}-${request.file!.originalname}`

    await makeFileObject({
      designation: 'listing-edf',
      createdBy: new UniqueEntityID(request.user.id),
      filename,
      contents,
    })
      .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
      .andThen((fileId) => {
        return eventStore.publish(
          new ListingEDFImporté({ payload: { fileId, uploadedBy: request.user.id } })
        )
      })
      .match(
        () => {
          return response.redirect(
            addQueryParams(routes.IMPORTER_LISTING_EDF, {
              success: "L'import s'est fait avec succès.",
              ...request.body,
            })
          )
        },
        (err) => {
          logger.error(err)
          return response.redirect(
            addQueryParams(routes.IMPORTER_LISTING_EDF, {
              error: 'Une erreur est survenue, merci de réessayer.',
              ...request.body,
            })
          )
        }
      )
  })
)

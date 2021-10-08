import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { claimProject, ensureRole } from '../../config'
import { createReadStream } from 'fs'
import { upload } from '../upload'

v1Router.post(
  routes.USER_CLAIM_PROJECTS,
  ensureRole('porteur-projet'),
  upload.multiple(),
  asyncHandler(async (request, response) => {
    const { projectIds } = request.body
    const { user, files } = request

    const projectsIdsArr = Array.isArray(projectIds) ? projectIds : [projectIds]

    const params = convertBodyParamsToFormattedJSON(request.body, projectsIdsArr, files)

    try {
      const projectsClaimedPromises = await Promise.allSettled(
        projectsIdsArr.map(async (projectId) => {
          const projectParams = params.find((param) => param.projectId === projectId)
          if (!projectParams) return

          return await claimProject({
            projectId,
            prix: Number(projectParams.prix?.trim()),
            numCRE: projectParams.numCRE?.trim(),
            claimedBy: user,
            attestationDesignationProofFile: projectParams.attestationDesignationFile,
          })
        })
      )

      const errors: string[] = []
      const successes: string[] = []

      projectsClaimedPromises.map((promise) => {
        if (promise.status === 'fulfilled') {
          if (promise.value?.isErr()) {
            // @ts-ignore
            errors.push(promise.value.error)
          }

          promise.value?.map((projectName: string) => successes.push(projectName))
        }
      })

      const successMessage = `Les projets suivants ont été ajoutés à votre suivi de projets :\n${successes.join(
        '\n'
      )}`

      if (errors.length) {
        const redirectErrorParams: any = {
          error: `Les projets suivants n'ont pas pu être ajoutés car le prix ou le numéro CRE est erroné. Pensez également à vérifier que vous avez bien joint votre attestation de désignation.\n${errors.join(
            '\n'
          )}`,
          success: successes.length ? successMessage : undefined,
        }

        return response.redirect(
          addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, redirectErrorParams)
        )
      }

      return response.redirect(
        addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, {
          success: successMessage,
        })
      )
    } catch (error) {
      return response.redirect(
        addQueryParams(routes.USER_LIST_MISSING_OWNER_PROJECTS, {
          error: error.message,
        })
      )
    }
  })
)

function convertBodyParamsToFormattedJSON(body, projectIds: string[], files?) {
  const bodyKeys = Object.keys(body).filter((param) => param !== 'projectIds')

  return projectIds.reduce((acc, projectId) => {
    const projectDataFields: any = bodyKeys
      .filter((key) => key.includes(projectId))
      .reduce(
        (acc, curr) => {
          const propName = curr.split('|')[0]
          const propValue = body[curr]

          return { ...acc, [propName]: propValue }
        },
        { projectId }
      )

    const attestationDesignationFile = files?.find((file) => {
      const [propName, projId] = file.fieldname.split('|')
      return propName === 'attestation-designation' && projId === projectId
    })

    if (attestationDesignationFile) {
      projectDataFields.attestationDesignationFile = {
        contents: createReadStream(attestationDesignationFile.path),
        filename: attestationDesignationFile.originalname,
      }
    }

    return [...acc, projectDataFields]
  }, []) as any
}

import { ensureRole, projectRepo } from '@config'
import { UniqueEntityID } from '../../core/domain'
import { logger } from '../../core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

// Ce point d'entrée est destiné à n'être appelé qu'une seule fois

v1Router.get(
  '/admin/special-batiment13',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const projectIds = [
      '3f8bd93c-ce2e-4d38-993e-67cf3cc62890',
      '6113506b-996c-4c7f-9ea5-d76817d05f33',
      '1ba84458-0010-4b00-8be3-61673a0ec328',
      '07d8c4fb-f3f7-4dd2-a075-a12302d32497',
      'f7c6f879-aa89-47d0-9589-f1e2f91e3f3a',
      '72e66903-06ca-4b5a-a2f1-09a97bacab41',
      '6bd4cff3-8958-433e-8973-cc67fb760299',
      '8d60d76c-8c40-4bd0-8133-1440b3c61384',
      'cc778bec-fda9-48cb-83a6-807e3f9f0219',
      '4156905c-61ce-40d2-a4f0-9e826b083deb',
      'ef410ab1-cbe6-4737-a249-f524764ffe1a',
      'a786ff1c-ad17-476c-9b72-c333c3ea47f5',
    ]

    try {
      for (const projectId of projectIds) {
        const res = await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
          return project.setNotificationDate(request.user, -1)
        })
        if (res.isErr()) {
          throw res.error
        }
      }
    } catch (e) {
      logger.error(e)
      response.send('Une erreur est survenue')
    }

    response.send('Les projets ont bien été corrigés')
  })
)

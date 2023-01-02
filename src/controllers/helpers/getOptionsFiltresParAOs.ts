import { projectRepo, ContextSpecificProjectListFilter, userRepo } from '@dataAccess'
import { Request } from 'express'
import { AppelOffre } from '@entities'

export const getOptionsFiltresParAOs = async ({
  user,
  appelOffreId,
}: {
  user: Request['user']
  appelOffreId?: AppelOffre['id']
}): Promise<{
  existingAppelsOffres: string[]
  existingPeriodes: string[] | undefined
  existingFamilles: string[] | undefined
}> => {
  const getUserSpecificProjectListFilter = async (
    user: Request['user']
  ): Promise<ContextSpecificProjectListFilter> => {
    switch (user.role) {
      case 'dreal':
        const regions = await userRepo.findDrealsForUser(user.id)
        return {
          regions,
        }
      case 'porteur-projet':
        return {
          userId: user.id,
        }
      case 'admin':
      case 'dgec-validateur':
      case 'acheteur-obligé':
      case 'ademe':
      case 'cre':
      case 'caisse-des-dépôts':
        return {
          isNotified: true,
        }
    }
  }

  const userSpecificProjectListFilter = await getUserSpecificProjectListFilter(user)

  const existingAppelsOffres = await projectRepo.findExistingAppelsOffres(
    userSpecificProjectListFilter
  )

  const existingPeriodes = appelOffreId
    ? await projectRepo.findExistingPeriodesForAppelOffre(
        appelOffreId,
        userSpecificProjectListFilter
      )
    : undefined

  const existingFamilles = appelOffreId
    ? await projectRepo.findExistingFamillesForAppelOffre(
        appelOffreId,
        userSpecificProjectListFilter
      )
    : undefined

  return { existingAppelsOffres, existingPeriodes, existingFamilles }
}

import { errAsync, okAsync } from '@core/utils'
import { AppelOffre } from '@entities'
import { Project } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { makeModifierAppelOffreProjet } from './modifierAppelOffreProjet'

// Scénario
describe(`Modifier l'AO d'un projet avec un AO existant`, () => {
  it(`
    Quand on modifie l'AO d'un projet avec un AO existant
    Alors l'appel d'offre du projet est modifié`, async () => {
    const getAppelOffre = (appelOffreId: string) =>
      appelOffreId === 'AO existant'
        ? okAsync({ id: appelOffreId, title: `Ceci est un appel d'offre existant` } as AppelOffre)
        : errAsync(new EntityNotFoundError())

    const fakeProject = makeFakeProject()
    const projectRepo = fakeTransactionalRepo(fakeProject as Project)

    const modifierAppelOffre = makeModifierAppelOffreProjet({ projectRepo, getAppelOffre })
    const actualResult = await modifierAppelOffre({
      appelOffreId: 'AO existant',
      projectId: 'projet à modifier',
    })

    expect(actualResult.isOk()).toBe(true)
    expect(fakeProject.modifierAppelOffre).toHaveBeenCalledWith({
      id: 'AO existant',
      title: `Ceci est un appel d'offre existant`,
    } as AppelOffre)
  })

  it(`
    Quand on modifie l'AO d'un projet avec un AO inexistant
    Alors l'appel d'offre du projet n'est pas modifié
    Et on doit être informé que l'appel d'offre n'existe pas`, async () => {
    const getAppelOffre = (appelOffreId: string) =>
      appelOffreId === 'AO existant'
        ? okAsync({ id: appelOffreId, title: `Ceci est un appel d'offre existant` } as AppelOffre)
        : errAsync(new EntityNotFoundError())

    const fakeProject = makeFakeProject()
    const projectRepo = fakeTransactionalRepo(fakeProject as Project)

    const modifierAppelOffre = makeModifierAppelOffreProjet({ projectRepo, getAppelOffre })
    const actualResult = await modifierAppelOffre({
      appelOffreId: 'AO inexistant',
      projectId: 'projet à ne pas modifier',
    })

    expect(fakeProject.modifierAppelOffre).not.toHaveBeenCalled()

    const actualError = actualResult._unsafeUnwrapErr()
    expect(actualError).toBeInstanceOf(EntityNotFoundError)
  })
})

import makeListGarantiesFinancieres from './listGarantiesFinancieres'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import { makeProject, makeUser, Project } from '../entities'
import { userRepo, projectRepo, resetDatabase } from '../dataAccess/inMemory'
import expectPuppeteer from 'expect-puppeteer'

const listGarantiesFinancieres = makeListGarantiesFinancieres({
  userRepo,
  projectRepo,
})

describe('listGarantiesFinancieres use-case', () => {
  let garantiesFinancieres: Project[]

  beforeAll(async () => {
    resetDatabase()

    // Add projects
    await Promise.all(
      [
        {
          // Wrong region
          regionProjet: 'Bretagne',
          garantiesFinancieresSubmittedOn: 1234,
        },
        {
          // Correct region in multiple region project
          regionProjet: 'Corse / Bretagne',
          garantiesFinancieresSubmittedOn: 1234,
        },
        {
          // Correct region in single region project
          regionProjet: 'Corse',
          garantiesFinancieresSubmittedOn: 1234,
        },
        {
          // Correct other region
          regionProjet: 'Occitanie',
          garantiesFinancieresSubmittedOn: 1234,
        },
        {
          // Correct region but without GF
          regionProjet: 'Corse',
          garantiesFinancieresSubmittedOn: 0,
        },
      ]
        .map(makeFakeProject)
        .map(makeProject)
        .filter((item) => item.is_ok())
        .map((item) => item.unwrap())
        .map(projectRepo.save)
    )

    // Add a user
    const [user] = (
      await Promise.all(
        [{ role: 'dreal' }]
          .map(makeFakeUser)
          .map(makeUser)
          .filter((item) => item.is_ok())
          .map((item) => item.unwrap())
          .map(userRepo.insert)
      )
    )
      .filter((item) => item.is_ok())
      .map((item) => item.unwrap())

    expect(user).toBeDefined()
    if (!user) return

    // Link dreal users to dreal
    await userRepo.addToDreal(user.id, 'Corse')
    await userRepo.addToDreal(user.id, 'Occitanie')

    // Make the call
    garantiesFinancieres = await listGarantiesFinancieres({ user })
  })

  it('should include projects from the same region as the dreal user', async () => {
    expect(garantiesFinancieres).toHaveLength(3)

    expect(
      garantiesFinancieres.every((garantie) =>
        garantie.regionProjet
          .split(' / ')
          .some((region) => ['Corse', 'Occitanie'].includes(region))
      )
    ).toEqual(true)
  })

  it('should include projects that have submitted garanties financières', async () => {
    expect(
      garantiesFinancieres.every(
        (garantie) => garantie.garantiesFinancieresSubmittedOn !== 0
      )
    ).toEqual(true)
  })
})

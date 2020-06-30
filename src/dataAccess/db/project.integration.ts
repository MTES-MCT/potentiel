import { Sequelize } from 'sequelize'
import { expect } from 'chai'
import { v4 as uuid } from 'uuid'
import { ProjectRepo } from '../project'
import { makeProjectRepo } from './project'
import { makeUserRepo } from './user'
import { appelOffreRepo } from '../inMemory/appelOffre'
import { UserRepo } from '../user'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'

import {
  userRepo,
  projectRepo,
  initDatabase,
  resetDatabase,
  sequelize,
} from './'
import { Pagination } from '../../types'

const defaultPagination = { page: 0, pageSize: 10 } as Pagination

describe('projectRepo sequelize', () => {
  before(async () => {
    await initDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('findAll', () => {
    describe('given no arguments', () => {
      it('should return all projects', async () => {
        await Promise.all(
          [
            {
              id: uuid(),
            },
            {
              id: uuid(),
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findAll()
        expect(results).to.have.lengthOf(2)
      })
    })

    describe('given filters', () => {
      it('should return all projects that match the filters', async () => {
        const targetProjectId = uuid()

        const goodProperties = {
          notifiedOn: 1,
          garantiesFinancieresSubmittedOn: 1,
          classe: 'Classé',
          appelOffreId: 'Fessenheim',
          periodeId: '2',
          familleId: '1',
          email: 'test122345@test.com',
          nomProjet: 'test',
        }

        await Promise.all(
          [
            {
              id: targetProjectId,
              ...goodProperties,
            },
            {
              id: uuid(),
              ...goodProperties,
              notifiedOn: 0,
            },
            {
              id: uuid(),
              ...goodProperties,
              garantiesFinancieresSubmittedOn: 0,
            },
            {
              id: uuid(),
              ...goodProperties,
              classe: 'Eliminé',
            },
            {
              id: uuid(),
              ...goodProperties,
              appelOffreId: 'Autre',
            },
            {
              id: uuid(),
              ...goodProperties,
              periodeId: '1',
            },
            {
              id: uuid(),
              ...goodProperties,
              familleId: '2',
            },
            {
              id: uuid(),
              ...goodProperties,
              email: 'notgood@test.com',
            },
            {
              id: uuid(),
              ...goodProperties,
              nomProjet: 'other',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findAll({
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
          appelOffreId: 'Fessenheim',
          periodeId: '2',
          familleId: '1',
          email: 'test122345@test.com',
          nomProjet: 'test',
        })

        expect(results).to.have.lengthOf(1)
        expect(results[0].id).to.equal(targetProjectId)
      })
    })

    describe('given filters and a pagination', () => {
      it('should return a paginated list of projects that match the filters', async () => {
        const targetProjectId = uuid()
        await Promise.all(
          [
            {
              id: targetProjectId,
              notifiedOn: 1,
            },
            {
              id: uuid(),
              notifiedOn: 0,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const { itemCount, items } = await projectRepo.findAll(
          { isNotified: true },
          defaultPagination
        )
        expect(itemCount).to.equal(1)
        expect(items[0].id).to.equal(targetProjectId)
      })
    })
  })

  describe('searchAll', () => {
    it('should return projects that contain the search term', async () => {
      const targetProjectId = uuid()
      await Promise.all(
        [
          {
            id: targetProjectId,
            nomCandidat: 'the search term is there',
          },
          {
            id: uuid(),
            nomCandidat: 'nothing here',
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const { itemCount, items } = await projectRepo.searchAll(
        'term',
        defaultPagination
      )
      expect(itemCount).to.equal(1)
      expect(items[0].id).to.equal(targetProjectId)
    })

    it('should return projects that match all the filters', async () => {
      const targetProjectId = uuid()
      await Promise.all(
        [
          {
            id: targetProjectId,
            nomCandidat: 'the search term is there',
            notifiedOn: 1,
          },
          {
            id: uuid(),
            nomCandidat: 'the search term is there',
            notifiedOn: 0,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const { itemCount, items } = await projectRepo.searchAll(
        'term',
        defaultPagination,
        {
          isNotified: true,
        }
      )
      expect(itemCount).to.equal(1)
      expect(items[0].id).to.equal(targetProjectId)
    })
  })

  describe('findAllForUser', () => {
    it('should only return user projects', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const userProjectId = uuid()

      await Promise.all(
        [
          {
            // Good user, matches query
            id: userProjectId,
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Bad user, matches query
            id: uuid(),
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      await userRepo.addProject(userId, userProjectId)

      const results = await projectRepo.findAllForUser(
        userId,
        defaultPagination,
        {
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
        }
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(userProjectId)
    })

    it('should return projects that match the query', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const userProjectId1 = uuid()
      const userProjectId2 = uuid()
      const userProjectId3 = uuid()
      const userProjectId4 = uuid()

      await Promise.all(
        [
          {
            // Good user, matches filter
            id: userProjectId1,
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good user, does not match all filters
            id: userProjectId2,
            garantiesFinancieresSubmittedOn: 0,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good user, does not match all filters
            id: userProjectId3,
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Eliminé',
            notifiedOn: 1,
          },
          {
            // Good user, does not match all filters
            id: userProjectId4,
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 0,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      await userRepo.addProject(userId, userProjectId1)
      await userRepo.addProject(userId, userProjectId2)
      await userRepo.addProject(userId, userProjectId3)
      await userRepo.addProject(userId, userProjectId4)

      const results = await projectRepo.findAllForUser(
        userId,
        defaultPagination,
        {
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
        }
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(userProjectId1)
    })
  })

  describe('searchForUser', () => {
    it('should return projects that contain the search term', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const userProjectId1 = uuid()
      const userProjectId2 = uuid()

      await Promise.all(
        [
          {
            // Good user, good search term
            id: userProjectId1,
            nomCandidat: 'the search term is there',
          },
          {
            // Good user, bad search term
            id: userProjectId2,
            nomCandidat: 'nothing to see here',
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      await userRepo.addProject(userId, userProjectId1)
      await userRepo.addProject(userId, userProjectId2)

      const results = await projectRepo.searchForUser(
        userId,
        'term',
        defaultPagination
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(userProjectId1)
    })

    it('should only return user projects', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const userProjectId = uuid()

      await Promise.all(
        [
          {
            // Good user, good search term
            id: userProjectId,
            nomCandidat: 'the search term is there',
          },
          {
            // Bad user, good search term
            id: uuid(),
            nomCandidat: 'the search term is there',
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      await userRepo.addProject(userId, userProjectId)

      const results = await projectRepo.searchForUser(
        userId,
        'term',
        defaultPagination
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(userProjectId)
    })

    it('should return projects that match all the filters', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const userProjectId1 = uuid()
      const userProjectId2 = uuid()
      const userProjectId3 = uuid()
      const userProjectId4 = uuid()

      await Promise.all(
        [
          {
            // Good user, good search term, matches filter
            id: userProjectId1,
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good user, good search term, does not match all filters
            id: userProjectId2,
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 0,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good user, good search term, does not match all filters
            id: userProjectId3,
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Eliminé',
            notifiedOn: 1,
          },
          {
            // Good user, good search term, does not match all filters
            id: userProjectId4,
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 0,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      await userRepo.addProject(userId, userProjectId1)
      await userRepo.addProject(userId, userProjectId2)
      await userRepo.addProject(userId, userProjectId3)
      await userRepo.addProject(userId, userProjectId4)

      const results = await projectRepo.searchForUser(
        userId,
        'term',
        defaultPagination,
        {
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
        }
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(userProjectId1)
    })
  })

  describe('findAllForRegions', () => {
    describe('when a single region is given', () => {
      it('should only return projects from the region', async () => {
        const regionProjectId1 = uuid()
        const regionProjectId2 = uuid()

        await Promise.all(
          [
            {
              // Good region
              id: regionProjectId1,
              regionProjet: 'Corse',
            },
            {
              // Contains good region
              id: regionProjectId2,
              regionProjet: 'Occitanie / Corse / Bretagne',
            },
            {
              // Bad region
              id: uuid(),
              regionProjet: 'Bretagne',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findAllForRegions(
          'Corse',
          defaultPagination
        )

        expect(results.itemCount).to.equal(2)
        expect(results.items.map((item) => item.id)).to.include.members([
          regionProjectId1,
          ,
          regionProjectId2,
        ])
      })
    })

    describe('when multiple regions are given', () => {
      it('should only return projects from at least one of the regions', async () => {
        const regionProjectId1 = uuid()
        const regionProjectId2 = uuid()

        await Promise.all(
          [
            {
              // Good region
              id: regionProjectId1,
              regionProjet: 'Corse',
            },
            {
              // Contains a good region
              id: regionProjectId2,
              regionProjet: 'Occitanie / Bretagne',
            },
            {
              // Bad region
              id: uuid(),
              regionProjet: 'Bretagne',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findAllForRegions(
          ['Corse', 'Occitanie'],
          defaultPagination
        )

        expect(results.itemCount).to.equal(2)
        expect(results.items.map((item) => item.id)).to.include.members([
          regionProjectId1,
          ,
          regionProjectId2,
        ])
      })
    })

    it('should return projects that match all the filters', async () => {
      const regionProjectId1 = uuid()

      await Promise.all(
        [
          {
            // Good region, matches filter
            id: regionProjectId1,
            regionProjet: 'Corse',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good region, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            garantiesFinancieresSubmittedOn: 0,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good region, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Eliminé',
            notifiedOn: 1,
          },
          {
            // Good region, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 0,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const results = await projectRepo.findAllForRegions(
        'Corse',
        defaultPagination,
        {
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
        }
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(regionProjectId1)
    })
  })

  describe('searchForRegions', () => {
    it('should return projects that contain the search term', async () => {
      const regionProjectId = uuid()

      await Promise.all(
        [
          {
            // Good region, contains search term
            id: regionProjectId,
            regionProjet: 'Corse',
            nomCandidat: 'the search term is there',
          },
          {
            // Good region, bad search term
            id: uuid(),
            regionProjet: 'Corse',
            nomCandidat: 'nothing to see here',
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const results = await projectRepo.searchForRegions(
        'Corse',
        'term',
        defaultPagination
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(regionProjectId)
    })

    describe('when a single region is given', () => {
      it('should only return projects from the region', async () => {
        const regionProjectId1 = uuid()
        const regionProjectId2 = uuid()

        await Promise.all(
          [
            {
              // Good region, contains search term
              id: regionProjectId1,
              regionProjet: 'Corse',
              nomCandidat: 'the search term is there',
            },
            {
              // Good region, contains search term
              id: regionProjectId2,
              regionProjet: 'Occitanie / Corse / Bretagne',
              nomCandidat: 'the search term is there',
            },
            {
              // Bad region, good search term
              id: uuid(),
              regionProjet: 'Bretagne',
              nomCandidat: 'the search term is there',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.searchForRegions(
          'Corse',
          'term',
          defaultPagination
        )

        expect(results.itemCount).to.equal(2)
        expect(results.items.map((item) => item.id)).to.include.members([
          regionProjectId1,
          ,
          regionProjectId2,
        ])
      })
    })

    describe('when multiple regions are given', () => {
      it('should only return projects from at least one of the regions', async () => {
        const regionProjectId1 = uuid()
        const regionProjectId2 = uuid()

        await Promise.all(
          [
            {
              // Good region, contains search term
              id: regionProjectId1,
              regionProjet: 'Corse',
              nomCandidat: 'the search term is there',
            },
            {
              // Good region, contains search term
              id: regionProjectId2,
              regionProjet: 'Occitanie / Bretagne',
              nomCandidat: 'the search term is there',
            },
            {
              // Bad region, good search term
              id: uuid(),
              regionProjet: 'Bretagne',
              nomCandidat: 'the search term is there',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.searchForRegions(
          ['Corse', 'Occitanie'],
          'term',
          defaultPagination
        )

        expect(results.itemCount).to.equal(2)
        expect(results.items.map((item) => item.id)).to.include.members([
          regionProjectId1,
          ,
          regionProjectId2,
        ])
      })
    })

    it('should return projects that match all the filters', async () => {
      const regionProjectId1 = uuid()

      await Promise.all(
        [
          {
            // Good region, good search term, matches filter
            id: regionProjectId1,
            regionProjet: 'Corse',
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good region, good search term, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 0,
            classe: 'Classé',
            notifiedOn: 1,
          },
          {
            // Good region, good search term, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Eliminé',
            notifiedOn: 1,
          },
          {
            // Good region, good search term, does not match all filters
            id: uuid(),
            regionProjet: 'Corse',
            nomCandidat: 'the search term is there',
            garantiesFinancieresSubmittedOn: 1,
            classe: 'Classé',
            notifiedOn: 0,
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const results = await projectRepo.searchForRegions(
        'Corse',
        'term',
        defaultPagination,
        {
          isNotified: true,
          hasGarantiesFinancieres: true,
          isClasse: true,
        }
      )

      expect(results.itemCount).to.equal(1)
      expect(results.items[0].id).to.equal(regionProjectId1)
    })
  })

  describe('findExistingAppelsOffres', () => {
    describe('given no params', () => {
      it('should return appelOffreIds which have at least one project', async () => {
        const targetAppelOffre = 'Fessenheim'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingAppelsOffres()

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetAppelOffre)
      })
    })

    describe('given isNotified = true param', () => {
      it('should return appelOffreIds which have at least one notified project', async () => {
        const targetAppelOffre = 'Fessenheim'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              notifiedOn: 0,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingAppelsOffres({
          isNotified: true,
        })

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetAppelOffre)
      })
    })

    describe('given isNotified = false param', () => {
      it('should return appelOffreIds which have at least one unnotified project', async () => {
        const targetAppelOffre = 'Fessenheim'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingAppelsOffres({
          isNotified: false,
        })

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetAppelOffre)
      })
    })

    describe('given userId param', () => {
      it('should return appelOffreIds which have at least one notified project from this userId', async () => {
        const targetAppelOffre = 'Fessenheim'

        const userId = uuid()

        await userRepo.insert(
          makeFakeUser({
            id: userId,
          })
        )

        const userProjectId1 = uuid()
        const userProjectId2 = uuid()

        await Promise.all(
          [
            {
              id: userProjectId1,
              appelOffreId: targetAppelOffre,
              notifiedOn: 1,
            },
            {
              id: userProjectId2,
              appelOffreId: 'other',
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        await userRepo.addProject(userId, userProjectId1)
        await userRepo.addProject(userId, userProjectId2)

        const results = await projectRepo.findExistingAppelsOffres({
          userId,
        })

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetAppelOffre)
      })
    })

    describe('given regions param', () => {
      it('should return appelOffreIds which have at least one notified project from this region', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetAppelOffre2 = 'CRE4 - Batiment'
        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              regionProjet: 'Corse',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre2,
              regionProjet: 'Bretagne / Occitanie',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              regionProjet: 'Corse',
              notifiedOn: 0,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingAppelsOffres({
          regions: ['Corse', 'Occitanie'],
        })

        expect(results).to.have.lengthOf(2)
        expect(results).to.include.members([
          targetAppelOffre,
          targetAppelOffre2,
        ])
      })
    })
  })

  describe('findExistingPeriodesForAppelOffre', () => {
    describe('given an appelOffreId and no params', () => {
      it('should return periodeIds which have at least one project in this appelOffreId', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetPeriode = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode,
            },
            {
              id: uuid(),
              appelOffreId: 'otherAO',
              periodeId: 'otherPeriode',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingPeriodesForAppelOffre(
          targetAppelOffre
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetPeriode)
      })
    })

    describe('given isNotified = true param', () => {
      it('should return periodeIds which have at least one notified project in this appelOffreId', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetPeriode = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode,
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: 'other',
              notifiedOn: 0,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingPeriodesForAppelOffre(
          targetAppelOffre,
          {
            isNotified: true,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetPeriode)
      })
    })

    describe('given isNotified = false param', () => {
      it('should return periodeIds which have at least one unnotified project in this AppelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetPeriode = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode,
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: 'other',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingPeriodesForAppelOffre(
          targetAppelOffre,
          {
            isNotified: false,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetPeriode)
      })
    })

    describe('given userId param', () => {
      it('should return periodeIds which have at least one notified project from this userId in this appelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetPeriode = '1'

        const userId = uuid()

        await userRepo.insert(
          makeFakeUser({
            id: userId,
          })
        )

        const userProjectId1 = uuid()
        const userProjectId2 = uuid()

        await Promise.all(
          [
            {
              id: userProjectId1,
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode,
              notifiedOn: 1,
            },
            {
              id: userProjectId2,
              appelOffreId: targetAppelOffre,
              periodeId: 'other',
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: 'other2',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        await userRepo.addProject(userId, userProjectId1)
        await userRepo.addProject(userId, userProjectId2)

        const results = await projectRepo.findExistingPeriodesForAppelOffre(
          targetAppelOffre,
          {
            userId,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetPeriode)
      })
    })

    describe('given regions param', () => {
      it('should return periodeIds which have at least one notified project from this region in this appelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetPeriode1 = '1'
        const targetPeriode2 = '2'
        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode1,
              regionProjet: 'Corse',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: targetPeriode2,
              regionProjet: 'Bretagne / Occitanie',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              periodeId: 'other',
              regionProjet: 'Corse',
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              periodeId: 'other2',
              regionProjet: 'Corse',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingPeriodesForAppelOffre(
          targetAppelOffre,
          {
            regions: ['Corse', 'Occitanie'],
          }
        )

        expect(results).to.have.lengthOf(2)
        expect(results).to.include.members([targetPeriode1, targetPeriode2])
      })
    })
  })

  describe('findExistingFamillesForAppelOffre', () => {
    describe('given an appelOffreId and no params', () => {
      it('should return familleIds which have at least one project in this appelOffreId', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetFamille = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: targetFamille,
            },
            {
              id: uuid(),
              appelOffreId: 'otherAO',
              familleId: 'otherFamille',
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingFamillesForAppelOffre(
          targetAppelOffre
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetFamille)
      })
    })

    describe('given isNotified = true param', () => {
      it('should return familleIds which have at least one notified project in this appelOffreId', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetFamille = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: targetFamille,
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: 'other',
              notifiedOn: 0,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingFamillesForAppelOffre(
          targetAppelOffre,
          {
            isNotified: true,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetFamille)
      })
    })

    describe('given isNotified = false param', () => {
      it('should return familleIds which have at least one unnotified project in this AppelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetFamille = '1'

        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: targetFamille,
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: 'other',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingFamillesForAppelOffre(
          targetAppelOffre,
          {
            isNotified: false,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetFamille)
      })
    })

    describe('given userId param', () => {
      it('should return familleIds which have at least one notified project from this userId in this appelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetFamille = '1'

        const userId = uuid()

        await userRepo.insert(
          makeFakeUser({
            id: userId,
          })
        )

        const userProjectId1 = uuid()
        const userProjectId2 = uuid()

        await Promise.all(
          [
            {
              id: userProjectId1,
              appelOffreId: targetAppelOffre,
              familleId: targetFamille,
              notifiedOn: 1,
            },
            {
              id: userProjectId2,
              appelOffreId: targetAppelOffre,
              familleId: 'other',
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: 'other2',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        await userRepo.addProject(userId, userProjectId1)
        await userRepo.addProject(userId, userProjectId2)

        const results = await projectRepo.findExistingFamillesForAppelOffre(
          targetAppelOffre,
          {
            userId,
          }
        )

        expect(results).to.have.lengthOf(1)
        expect(results[0]).to.equal(targetFamille)
      })
    })

    describe('given regions param', () => {
      it('should return familleIds which have at least one notified project from this region in this appelOffre', async () => {
        const targetAppelOffre = 'Fessenheim'
        const targetFamille1 = '1'
        const targetFamille2 = '2'
        await Promise.all(
          [
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: targetFamille1,
              regionProjet: 'Corse',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: targetFamille2,
              regionProjet: 'Bretagne / Occitanie',
              notifiedOn: 1,
            },
            {
              id: uuid(),
              appelOffreId: targetAppelOffre,
              familleId: 'other',
              regionProjet: 'Corse',
              notifiedOn: 0,
            },
            {
              id: uuid(),
              appelOffreId: 'other',
              familleId: 'other2',
              regionProjet: 'Corse',
              notifiedOn: 1,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const results = await projectRepo.findExistingFamillesForAppelOffre(
          targetAppelOffre,
          {
            regions: ['Corse', 'Occitanie'],
          }
        )

        expect(results).to.have.lengthOf(2)
        expect(results).to.include.members([targetFamille1, targetFamille2])
      })
    })
  })
})

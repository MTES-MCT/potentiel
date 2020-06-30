import makeListProjects from './listProjects'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import defaultPagination from '../__tests__/fixtures/pagination'
import { makeUser, User, DREAL, Project } from '../entities'
import { PaginatedList } from '../types'

import { projectRepo, userRepo } from '../dataAccess/inMemory'

const emptyListPromise: Promise<PaginatedList<Project>> = Promise.resolve({
  items: [],
  pagination: {
    page: 0,
    pageSize: 0,
  },
  pageCount: 0,
  itemCount: 0,
})

const voidFn: () => Promise<PaginatedList<Project>> = () => {
  throw 'voidFn should not be called by test case'
}

describe('listProjects use-case', () => {
  // const fakeProjects = [
  //   makeFakeProject({
  //     id: '1',
  //     appelOffreId: 'appelOffre1',
  //     periodeId: 'periode1',
  //     notifiedOn: 1,
  //     regionProjet: 'Corse / Bretagne',
  //   }),
  //   makeFakeProject({
  //     id: '2',
  //     appelOffreId: 'appelOffre1',
  //     periodeId: 'periode2',
  //     notifiedOn: 1,
  //     regionProjet: 'Martinique',
  //   }),
  //   makeFakeProject({
  //     id: '3',
  //     appelOffreId: 'appelOffre2',
  //     periodeId: 'periode1',
  //     notifiedOn: 1,
  //     regionProjet: 'Guyane',
  //   }),
  //   makeFakeProject({
  //     id: '4',
  //     appelOffreId: 'appelOffre3',
  //     periodeId: 'periode1',
  //     notifiedOn: 0,
  //     regionProjet: 'Corse',
  //   }),
  // ]
  // beforeAll(async () => {
  //   await Promise.all(fakeProjects.map(projectRepo.save))
  // })
  describe('given the user is admin', () => {
    describe('given a search term', () => {
      it('should return all notified projects that contain the search term', async () => {
        const listProjects = makeListProjects({
          searchForRegions: voidFn,
          findAllForRegions: voidFn,
          searchForUser: voidFn,
          findAllForUser: voidFn,
          searchAll: voidFn,
          findAll: voidFn,
          findExistingAppelsOffres: voidFn,
          findExistingPeriodesForAppelOffre: voidFn,
          findExistingFamillesForAppelOffre: voidFn,
          findDrealsForUser: voidFn,
        })
      })
    })

    //   let user: User
    //   beforeAll(async () => {
    //     const [insertedUser] = (
    //       await Promise.all(
    //         [makeFakeUser({ role: 'admin' })]
    //           .map(makeUser)
    //           .filter((item) => item.is_ok())
    //           .map((item) => item.unwrap())
    //           .map(userRepo.insert)
    //       )
    //     )
    //       .filter((item) => item.is_ok())
    //       .map((item) => item.unwrap())
    //     expect(insertedUser).toBeDefined()
    //     if (!insertedUser) return
    //     user = insertedUser
    //   })
    it('should return all projects that have been notified', async () => {
      //     const notifiedProjects = fakeProjects.filter(
      //       (project) => project.notifiedOn > 0
      //     )
      //     const foundProjects = await listProjects({
      //       user,
      //       pagination: defaultPagination,
      //     })
      //     expect(foundProjects.items).toHaveLength(notifiedProjects.length)
      //     notifiedProjects.forEach((fakeProject) => {
      //       expect(foundProjects.items).toContainEqual(
      //         expect.objectContaining(fakeProject)
      //       )
      //     })
      //     foundProjects.items.forEach((foundProject) => {
      //       expect(foundProject.notifiedOn).not.toEqual(0)
      //     })
      //   })
      //   it('should return all projects from given appelOffre', async () => {
      //     const foundProjects = await listProjects({
      //       user,
      //       appelOffreId: 'appelOffre1',
      //       pagination: defaultPagination,
      //     })
      //     expect(foundProjects.items).toHaveLength(2)
      //     expect(
      //       foundProjects.items.every(
      //         (project) => project.appelOffreId === 'appelOffre1'
      //       )
      //     ).toBeTruthy()
      //   })
      //   it('should return all projects from given appelOffre and periode', async () => {
      //     const foundProjects = await listProjects({
      //       user,
      //       appelOffreId: 'appelOffre1',
      //       periodeId: 'periode1',
      //       pagination: defaultPagination,
      //     })
      //     expect(foundProjects.items).toHaveLength(1)
      //     expect(foundProjects.items[0].appelOffreId).toEqual('appelOffre1')
      //     expect(foundProjects.items[0].periodeId).toEqual('periode1')
      //   })
      //   it('should ignore periode if appelOffre is not given', async () => {
      //     const foundProjects = await listProjects({
      //       user,
      //       periodeId: 'periode1',
      //       pagination: defaultPagination,
      //     })
      //     expect(foundProjects.items).toHaveLength(3)
    })
  })
  // describe('when the user is dreal', () => {
  //   let user: User
  //   const region: DREAL = 'Corse'
  //   beforeAll(async () => {
  //     const [insertedUser] = (
  //       await Promise.all(
  //         [makeFakeUser({ role: 'dreal' })]
  //           .map(makeUser)
  //           .filter((item) => item.is_ok())
  //           .map((item) => item.unwrap())
  //           .map(userRepo.insert)
  //       )
  //     )
  //       .filter((item) => item.is_ok())
  //       .map((item) => item.unwrap())
  //     expect(insertedUser).toBeDefined()
  //     if (!insertedUser) return
  //     user = insertedUser
  //     const drealAddition = await userRepo.addToDreal(user.id, region)
  //     expect(drealAddition.is_ok()).toEqual(true)
  //   })
  //   it('should return all projects from that region that have been notified', async () => {
  //     const foundProjects = await listProjects({
  //       user,
  //       pagination: defaultPagination,
  //     })
  //     expect(foundProjects.items).toHaveLength(1)
  //     foundProjects.items.forEach((foundProject) => {
  //       expect(foundProject.regionProjet).toContain(region)
  //       expect(foundProject.notifiedOn).not.toEqual(0)
  //     })
  //   })
  // })
})

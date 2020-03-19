import makeListProjects from './listProjects'

import makeFakeProject from '../__tests__/fixtures/project'

import { projectRepo } from '../dataAccess/inMemory'

const listProjects = makeListProjects({ projectRepo })

describe('listProjects use-case', () => {
  const fakeProjects = [
    makeFakeProject(),
    makeFakeProject({ id: '2', email: 'otherEmail ' })
  ]

  beforeAll(async () => {
    await Promise.all(fakeProjects.map(projectRepo.insert))
  })

  it('should return all projects', async () => {
    expect.assertions(fakeProjects.length + 1)
    const foundProjects = await listProjects()

    expect(foundProjects).toHaveLength(fakeProjects.length)
    fakeProjects.forEach(fakeProject => {
      expect(foundProjects).toContainEqual(expect.objectContaining(fakeProject))
    })
  })
})

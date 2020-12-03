import models from '../models'
import { sequelize } from '../../../sequelize.config'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { makeGetUnnotifiedProjectsForPeriode } from './getUnnotifiedProjectsForPeriode'

describe('Sequelize getUnnotifiedProjectsForPeriode', () => {
  const getUnnotifiedProjectsForPeriode = makeGetUnnotifiedProjectsForPeriode(models)

  const appelOffreId = 'appelOffre1'
  const periodeId = 'periode1'

  const fakeProjects = [
    {
      id: 'target',
      email: 'candidate@test.test',
      nomRepresentantLegal: 'john doe',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
      familleId: 'famille1',
      notifiedOn: 0,
    },
    {
      id: 'notified',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
      notifiedOn: 1,
    },
    {
      id: 'otherPeriode',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode2',
      notifiedOn: 0,
    },
    {
      id: 'otherAppel',
      appelOffreId: 'appelOffre2',
      periodeId: 'periode1',
      notifiedOn: 0,
    },
  ].map(makeFakeProject)

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    const ProjectModel = models.Project
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should return a list of UnnotifiedProjectDTOs for projects that have not been notified for the specific periode', async () => {
    const projectsResult = await getUnnotifiedProjectsForPeriode(appelOffreId, periodeId)

    expect(projectsResult.isOk()).toBe(true)
    if (projectsResult.isErr()) return

    const projects = projectsResult.value

    expect(projects).toHaveLength(1)
    expect(projects).toEqual(
      expect.arrayContaining([
        {
          projectId: 'target',
          candidateEmail: 'candidate@test.test',
          candidateName: 'john doe',
          familleId: 'famille1',
        },
      ])
    )
  })
})

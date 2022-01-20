import moment from 'moment'
import { DomainEvent, EventBus } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeProject, makeUser, Project } from '@entities'
import { ProjectGFReminded } from '@modules/project'
import { InfraNotAvailableError } from '@modules/shared'
import routes from '../routes'
import { Ok, UnwrapForTest } from '../types'
import addAppelOffreToProject from '../__tests__/fixtures/addAppelOffreToProject'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRelanceGarantiesFinancieres from './relanceGarantiesFinancieres'

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('relanceGarantiesFinancieres use-case', () => {
  const fakeProject = UnwrapForTest(
    makeProject(
      makeFakeProject({
        notifiedOn: 1595943197734,
        appelOffreId: 'Fessenheim',
        periodeId: '2',
        familleId: '1',
      })
    )
  )

  addAppelOffreToProject(fakeProject)

  const findProjectsWithGarantiesFinancieresPendingBefore = jest.fn(async (beforeDate: number) => [
    fakeProject,
  ])
  const sendNotification = jest.fn()
  const saveProject = jest.fn(async (project: Project) => Ok(null))

  const fakeUser = UnwrapForTest(makeUser(makeFakeUser()))
  const getUsersForProject = jest.fn(async () => [fakeUser])

  const relanceGarantiesFinancieres = makeRelanceGarantiesFinancieres({
    eventBus: fakeEventBus,
    findProjectsWithGarantiesFinancieresPendingBefore,
    getUsersForProject,
    sendNotification,
    saveProject,
  })

  const projectGFRemindedHandler = jest.fn((event: ProjectGFReminded) => null)

  beforeAll(async () => {
    fakePublish.mockClear()
    const result = await relanceGarantiesFinancieres()

    expect(result.is_ok()).toEqual(true)
  })

  it('should get projects with garanties financieres pending in less than 15 days', () => {
    expect(findProjectsWithGarantiesFinancieresPendingBefore).toHaveBeenCalledTimes(1)
    const callTime = findProjectsWithGarantiesFinancieresPendingBefore.mock.calls[0][0]
    expect(callTime / 1000).toBeCloseTo(moment().add(15, 'days').toDate().getTime() / 1000, 0)
  })

  it('should send a notification to the user', () => {
    expect(getUsersForProject).toHaveBeenCalledWith(fakeProject.id)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    expect(sendNotification).toHaveBeenCalledWith({
      type: 'relance-gf',
      context: {
        projectId: fakeProject.id,
        userId: fakeUser.id,
      },
      variables: {
        nom_projet: fakeProject.nomProjet,
        code_projet: fakeProject.potentielIdentifier,
        date_designation: '28/07/2020',
        paragraphe_cdc: '5.3 et 6.2', // Cf AO Fessenheim
        duree_garanties: '42', // Cf AO Fessenheim
        invitation_link: routes.PROJECT_DETAILS(fakeProject.id),
      },
      message: {
        subject: `Rappel constitution garantie financière ${fakeProject.nomProjet}`,
        email: fakeUser.email,
        name: fakeUser.fullName,
      },
    })
  })

  it('should update each unnotified project from the periode as having been relancé', async () => {
    expect(saveProject).toHaveBeenCalledTimes(1)

    const fakeProjectUpdate = saveProject.mock.calls[0][0]

    expect(fakeProjectUpdate).toBeDefined()
    expect(fakeProjectUpdate.garantiesFinancieresRelanceOn / 1000).toBeCloseTo(Date.now() / 1000, 0)
    expect(fakeProjectUpdate.history).toHaveLength(1)
    if (!fakeProjectUpdate.history || !fakeProjectUpdate.history.length) return
    const notificationEvent = fakeProjectUpdate.history[0]
    expect(notificationEvent).toBeDefined()
    if (!notificationEvent) return
    expect(notificationEvent.type).toEqual('relance-gf')
    expect(notificationEvent.after).toEqual({
      garantiesFinancieresRelanceOn: fakeProjectUpdate.garantiesFinancieresRelanceOn,
    })
  })

  it('should trigger a ProjectGFReminded event', async () => {
    expect(fakePublish).toHaveBeenCalled()
    const targetEvent = fakePublish.mock.calls
      .map((call) => call[0])
      .find((event) => event.type === ProjectGFReminded.type) as ProjectGFReminded

    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.projectId).toEqual(fakeProject.id)
    expect(targetEvent.aggregateId).toEqual(fakeProject.id)
  })
})

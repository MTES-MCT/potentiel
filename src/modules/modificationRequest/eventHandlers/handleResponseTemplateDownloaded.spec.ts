import { UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { StoredEvent } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
import { ModificationRequestInstructionStarted, ResponseTemplateDownloaded } from '../events'
import { GetModificationRequestStatus } from '../queries/GetModificationRequestStatus'
import { handleResponseTemplateDownloaded } from './handleResponseTemplateDownloaded'

const eventBus = {
  publish: jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null)),
  subscribe: jest.fn(),
}

const modificationRequestId = new UniqueEntityID().toString()
const downloadedBy = new UniqueEntityID().toString()

describe('handleResponseTemplateDownloaded', () => {
  describe('when status is envoyée', () => {
    const getModificationRequestStatus = (jest.fn((modificationRequestId) =>
      okAsync('envoyée')
    ) as unknown) as GetModificationRequestStatus

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleResponseTemplateDownloaded({
        eventBus,
        getModificationRequestStatus,
      })(
        new ResponseTemplateDownloaded({
          payload: { modificationRequestId, downloadedBy },
        })
      )
    })

    it('should trigger ModificationRequestInstructionStarted', () => {
      const targetEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find(
          (event): event is ModificationRequestInstructionStarted =>
            event.type === ModificationRequestInstructionStarted.type
        )

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.modificationRequestId).toEqual(modificationRequestId)
    })
  })

  describe('when status is not envoyée', () => {
    const getModificationRequestStatus = (jest.fn((modificationRequestId) =>
      okAsync('otherstatus')
    ) as unknown) as GetModificationRequestStatus

    beforeAll(async () => {
      eventBus.publish.mockClear()

      await handleResponseTemplateDownloaded({
        eventBus,
        getModificationRequestStatus,
      })(
        new ResponseTemplateDownloaded({
          payload: { modificationRequestId, downloadedBy },
        })
      )
    })

    it('should not trigger ModificationRequestInstructionStarted', () => {
      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})

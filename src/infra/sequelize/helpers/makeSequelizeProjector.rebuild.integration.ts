import { sequelizeInstance } from '../../../sequelize.config'
import { resetDatabase, withSequelizeProjector } from '../helpers'
import { DataTypes, Transaction } from 'sequelize'
import { BaseDomainEvent, DomainEvent } from '../../../core/domain'
import { models } from '../models'
import { toPersistance } from './toPersistance'
import { ProjectNotified, ProjectNotifiedPayload } from '@modules/project'

const FakeProjection = withSequelizeProjector(() => {
  const model = sequelizeInstance.define(
    'fake_projection',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )

  model.associate = (models) => {}

  return model
})

interface OtherEventPayload {
  param1: string
}

class OtherEvent extends BaseDomainEvent<OtherEventPayload> implements DomainEvent {
  public static type: 'OtherEvent' = 'OtherEvent'
  public type = OtherEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: OtherEventPayload) {
    return undefined
  }
}

describe('rebuild', () => {
  const fakeDummyEventHandler = jest.fn()

  let transaction: Transaction

  beforeAll(async () => {
    await FakeProjection.sync({ force: true })
    await resetDatabase()

    await models.EventStore.bulkCreate(
      [
        new ProjectNotified({
          payload: { notifiedOn: 1 } as ProjectNotifiedPayload,
          original: { version: 1, occurredAt: new Date(2) },
        }),
        new ProjectNotified({
          payload: { notifiedOn: 2 } as ProjectNotifiedPayload,
          original: { version: 1, occurredAt: new Date(1) },
        }),
        new OtherEvent({ payload: { param1: '3' } }),
      ].map(toPersistance)
    )

    transaction = await sequelizeInstance.transaction()

    await FakeProjection.create({
      id: '1',
    })

    expect(await FakeProjection.count()).toBe(1)

    FakeProjection.projector.on(ProjectNotified, fakeDummyEventHandler)

    await FakeProjection.projector.rebuild(transaction)
    await transaction.commit()
  })

  it('should truncate the table', async () => {
    const result = await FakeProjection.count()
    expect(result).toBe(0)
  })

  it('should call handleEvent with all events of a handled type, ordered by occurredAt, from event store and the transaction', async () => {
    expect(fakeDummyEventHandler).toHaveBeenCalledTimes(2)
    expect(fakeDummyEventHandler).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: { notifiedOn: 2 },
      }),
      transaction
    )
    expect(fakeDummyEventHandler).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: { notifiedOn: 1 },
      }),
      transaction
    )
  })

  describe('when the transaction is rolled back', () => {
    beforeAll(async () => {
      await resetDatabase()
      await FakeProjection.sync({ force: true })

      await FakeProjection.create({
        id: '1',
      })

      expect(await FakeProjection.count()).toBe(1)

      const transaction = await sequelizeInstance.transaction()

      await FakeProjection.projector.rebuild(transaction)

      await transaction.rollback()
    })

    it('should rollback the truncate', async () => {
      const result = await FakeProjection.count()
      expect(result).toBe(1)
    })
  })
})

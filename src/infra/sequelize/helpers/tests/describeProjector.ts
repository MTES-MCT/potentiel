import { matches } from 'lodash'
import { resetDatabase } from '../resetDatabase'

interface ShouldCreateProps {
  model: any
  id: string
  value: any
}

interface ShouldUpdateProps {
  model: any
  id: string
  before: any
  after: any
}

interface ShouldDeleteProps {
  model: any
  prior: any[]
  remaining?: any[]
}

export const describeProjector = <Event extends { type: string }>(
  projector: (event: Event) => any
) => ({
  onEvent: (testEvent: Event) => ({
    shouldCreate: ({ model, id, value }: ShouldCreateProps) => {
      describe(`${model.name}.on${testEvent.type}`, () => {
        beforeAll(async () => {
          await resetDatabase()
        })

        it(`should create a ${model.name}`, async () => {
          await projector(testEvent)

          const createdItem = await model.findByPk(id)

          expect(createdItem).not.toBe(null)
          expect(createdItem).toMatchObject(value)
        })
      })
    },
    shouldUpdate: ({ model, id, before, after }: ShouldUpdateProps) => {
      describe(`${model.name}.on${testEvent.type}`, () => {
        beforeAll(async () => {
          await resetDatabase()
          await model.create(before)
        })

        it(`should update the ${model.name}`, async () => {
          await projector(testEvent)

          const updatedItem = await model.findByPk(id)

          expect(updatedItem).not.toBe(null)
          expect(updatedItem).toMatchObject(after)
        })
      })
    },
    shouldDelete: ({ model, prior, remaining }: ShouldDeleteProps) => {
      describe(`${model.name}.on${testEvent.type}`, () => {
        beforeAll(async () => {
          await resetDatabase()
          await model.bulkCreate(prior)
        })

        it(`should delete the designated ${model.name}`, async () => {
          await projector(testEvent)

          const actuallyRemainingItems = await model.findAll()

          expect(actuallyRemainingItems).toHaveLength(remaining ? remaining.length : 0)
          if (remaining) {
            for (const remainingItem of remaining) {
              expect(actuallyRemainingItems.some(matches(remainingItem))).toBe(true)
            }
          }
        })
      })
    },
  }),
})

'use strict'

import { ProjectDCRRemoved, ProjectDCRRemovedPayload } from '@modules/project'
import { QueryInterface, Sequelize, Op } from 'sequelize'
import models from '../models'
import { toPersistance } from '../helpers'
import { BaseDomainEvent as DomainEvent } from '@core/domain'

const projetsId = [
  'e8f0da30-74cf-4981-a490-33aae0b56d50',
  '0bbd4f0b-76a9-4a64-bb0e-a41ce6380e3e',
  '1091d16a-0c44-4e74-956b-7defedce6337',
  '11ddef08-6832-48a7-a173-0bebfb755b5f',
  '16e00c90-e95c-4687-9bd3-addc3f93c8e3',
  '270ce586-6d36-45ef-a47c-9e021c800c07',
  '295ba238-ae1b-4370-ae9d-4e781b7d2997',
  '296395de-b08b-4802-90ce-6debf528f592',
  '2b0b19ac-bff0-4d05-b821-06a710f66246',
  '2f7f1dfb-db67-43b8-abb3-bf877f769d42',
  '396a67a3-5676-4ae1-b8da-f7613aa70fc4',
  '3e6534da-aa47-4977-b88e-a98356bc4cbb',
  '3ec0f7f5-95b5-4e45-bc2b-35b7d6dab25e',
  '4367bed0-e492-4aa4-ba2e-d6a6253d7956',
  '484109dc-0b2c-4f30-9107-cbbf6b6bd2f5',
  '6acdfcba-1bfb-4bd8-9a47-6e478aa767bf',
  '77a1772b-9fba-469e-8a24-6763bc9c12f5',
  '7b6508ca-2317-40f2-8d8e-f46bad775f52',
  '7cdec126-664d-46da-9e75-752bc1bd65fe',
  '9eaa9ba9-2d94-48e7-a890-f7e04eaa9536',
  '9f907022-e724-4a1c-bdf7-377e04e8ac9c',
  'bd1cbb92-829e-4395-ad6b-f36464d715e2',
  'ca03cf45-7b4d-4d66-9d20-374c415c855b',
  'da00a315-484b-40ae-b640-1091d8083c17',
  'e6ec5fb9-9ca5-4d09-ad72-9c6967d7cb15',
  'f659fffe-c777-4a02-ad3f-70e05592e4ac',
  'fff54e05-d865-4814-a1ba-d503aa3aaa69',
]

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    const { EventStore } = models

    const évènementsÀMigrer: DomainEvent<ProjectDCRRemovedPayload>[] = []

    for (const id of projetsId) {
      const évènements = await EventStore.findAll(
        {
          where: {
            'payload.projectId': id,
            type: {
              [Op.in]: ['ProjectDCRSubmitted', 'ProjectDCRRemoved'],
            },
          },
          attributes: ['occurredAt', 'payload', 'type'],
          order: [['occurredAt', 'ASC']],
        },
        { transaction }
      )

      if (
        !évènements.length ||
        (évènements.length === 1 && évènements[0].type === 'ProjectDCRSubmitted')
      ) {
        return
      }

      const évènementsCibles = évènements.map(({ dataValues }) => dataValues).slice(0, -1)
      console.log(évènementsCibles.length)

      const nouveauxÉvènements: DomainEvent<ProjectDCRRemovedPayload>[] = évènementsCibles.map(
        (évènement, index) => {
          const {
            occurredAt,
            payload: { projectId, submittedBy },
            type,
          } = évènement
          const nextEvent = évènementsCibles[(index += 1)]

          if (
            type === 'ProjectDCRRemoved' ||
            !nextEvent ||
            nextEvent.type === 'ProjectDCRRemoved'
          ) {
            return
          }

          return toPersistance(
            new ProjectDCRRemoved({
              payload: {
                projectId,
                removedBy: submittedBy,
              },
              original: {
                occurredAt,
                version: 1,
              },
            })
          )
        }
      )

      évènementsÀMigrer.push(...nouveauxÉvènements)
    }

    try {
      await EventStore.bulkCreate(évènementsÀMigrer, { transaction })
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}

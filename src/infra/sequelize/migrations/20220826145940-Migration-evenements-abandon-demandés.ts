import { ModificationRequested } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { AbandonDemandé } from '@modules/demandeModification/demandeAbandon'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonDemandé from '../projectionsNext/projectEvents/updates/abandon/onAbandonDemandé'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    console.log('TEST')
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { EventStore } = models
      const demandesAbandonAMigrer: ModificationRequested[] = await EventStore.findAll(
        {
          where: {
            type: 'ModificationRequested',
            'payload.type': { [Op.eq]: 'abandon' },
          },
        },
        { transaction }
      )
      console.log(
        `${demandesAbandonAMigrer.length} modification requested de type abandon à migrer`
      )
      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandeAbandonAMigrer) => {
            const {
              payload: { modificationRequestId, requestedBy, fileId, justification, projectId },
              occurredAt,
            } = demandeAbandonAMigrer
            const événementAbandonExistant = await EventStore.findOne({
              where: {
                'payload.demandeAbandonId': demandeAbandonAMigrer.id,
                type: AbandonDemandé.type,
              },
            })
            if (événementAbandonExistant) return
            return new AbandonDemandé({
              payload: {
                demandeAbandonId: modificationRequestId,
                projetId: projectId,
                autorité: 'dgec',
                fichierId: fileId,
                justification,
                porteurId: requestedBy,
              },
              original: {
                occurredAt,
                version: 1,
              },
            })
          })
        )
      ).filter((e): e is AbandonDemandé => e?.type === 'AbandonDemandé')
      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonDemandé vont être ajoutés`
      )
      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })
      await Promise.all(
        nouveauxÉvénements.map((AbandonDemandé) => onAbandonDemandé(AbandonDemandé, transaction))
      )
      const modificationRequestIds = nouveauxÉvénements.map(
        (demande) => demande.payload.demandeAbandonId
      )
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequested',
          'payload.modificationRequestId': {
            [Op.in]: modificationRequestIds,
          },
        },
        transaction,
      })
      await transaction.commit()
    } catch (error) {
      console.log('TEST 1')
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {},
}

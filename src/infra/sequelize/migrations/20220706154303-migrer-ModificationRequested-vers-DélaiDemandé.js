'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const demandesDélaiAMigrer = await queryInterface.sequelize.query(
        ` SELECT mr.id, p."completionDueOn" 
          FROM "modificationRequests" mr
          INNER JOIN "projects" p ON mr."projectId" = p.id
          WHERE type = 'delai' 
          AND   status = 'envoyée';`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      console.log(`${demandesDélaiAMigrer.length} demandes de délai envoyées à migrer`)

      for (const demandeDélaiAMigrer of demandesDélaiAMigrer) {
        const événements = await queryInterface.sequelize.query(
          ` SELECT * 
            FROM "eventStores" 
            WHERE "aggregateId" && '{${demandeDélaiAMigrer.id}}';`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction,
          }
        )

        const { payload, ...modificationRequestedEvent } = événements[0]

        const dateThéoriqueDAchèvement = new Date(demandeDélaiAMigrer.completionDueOn)
        const dateAchèvementDemandée = dateThéoriqueDAchèvement.setMonth(
          dateThéoriqueDAchèvement.getMonth() + payload.delayInMonths
        )

        const nouvelÉvénement = {
          ...modificationRequestedEvent,
          type: 'DélaiDemandé',
          payload: {
            demandeDélaiId: payload.modificationRequestId,
            projetId: payload.projectId,
            autorité: payload.authority,
            fichierId: payload.fileId,
            justification: payload.justification,
            dateAchèvementDemandée,
            porteurId: payload.requestedBy,
          },
        }
        console.log(`Nouvel événement : ${JSON.stringify(nouvelÉvénement)}`)
        await queryInterface.bulkInsert(
          'eventStores',
          [{ ...nouvelÉvénement, payload: JSON.stringify(nouvelÉvénement.payload) }],
          { transaction }
        )
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}

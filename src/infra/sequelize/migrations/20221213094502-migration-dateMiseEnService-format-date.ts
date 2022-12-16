import { DataTypes, Op, QueryInterface, QueryTypes } from 'sequelize'
import models from '../models'
const { Project } = models

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const entréesÀModifier = await Project.findAll(
      {
        where: {
          dateMiseEnService: {
            [Op.ne]: null,
          },
        },
        attributes: ['id', 'dateMiseEnService'],
      },
      { transaction }
    )

    await queryInterface.addColumn('projects', 'newDateMiseEnService', {
      type: DataTypes.DATE,
      allowNull: true,
    })

    try {
      for (const { id, dateMiseEnService } of entréesÀModifier) {
        await queryInterface.sequelize.query(
          `UPDATE "projects" SET "newDateMiseEnService" = ? where "id" = ?`,
          {
            transaction,
            type: QueryTypes.UPDATE,
            replacements: [dateMiseEnService.toISOString(), id],
          }
        )
      }
      console.log(`${entréesÀModifier.length} projets ont une dateMiseEnService mis à jour`)
    } catch (e) {
      console.error(e)
      transaction.rollback()
      throw e
    }

    transaction.commit()
    await queryInterface.removeColumn('projects', 'dateMiseEnService')
    await queryInterface.renameColumn('projects', 'newDateMiseEnService', 'dateMiseEnService')
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('projects', 'newDateMiseEnService')
  },
}

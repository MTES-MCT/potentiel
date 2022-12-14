import { DataTypes, Op, QueryInterface } from 'sequelize'
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

    if (entréesÀModifier.length > 0) {
      await queryInterface.removeColumn('projects', 'dateMiseEnService')
      await queryInterface.addColumn('projects', 'dateMiseEnService', {
        type: DataTypes.DATE,
        allowNull: true,
      })
      for (const { id, dateMiseEnService } of entréesÀModifier) {
        try {
          await Project.update(
            {
              dateMiseEnService: new Date(dateMiseEnService),
            },
            {
              where: {
                id,
              },
            },
            {
              transaction,
            }
          )
        } catch (e) {
          console.error(e)
          transaction.rollback()
        }
      }
      console.log(`${entréesÀModifier.length} projets ont une dateMiseEnService mis à jour`)

      transaction.commit()
    } else {
      await queryInterface.removeColumn('projects', 'dateMiseEnService')
      await queryInterface.addColumn('projects', 'dateMiseEnService', {
        type: DataTypes.DATE,
        allowNull: true,
      })
      transaction.commit()
    }
  },

  down: async () => {},
}

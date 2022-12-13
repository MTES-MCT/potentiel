import { DataTypes, Op, QueryInterface } from 'sequelize'
import models from '../models'

export default {
  up: async (queryInterface: QueryInterface) => {
    const { Project } = models
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
    await queryInterface.removeColumn('projects', 'dateMiseEnService')
    await queryInterface.addColumn('projects', 'dateMiseEnService', {
      type: DataTypes.DATE,
      allowNull: true,
    })

    if (entréesÀModifier.length > 0) {
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
        }
      }
      console.log(`${entréesÀModifier.length} projets mis à jour`)
    }

    transaction.commit()
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('projects', 'dateMiseEnService', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },
}

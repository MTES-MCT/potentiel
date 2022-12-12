import { Op, QueryInterface } from 'sequelize'
import models from '../models'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const entréesÀModifier = await models.Project.findAll(
      {
        where: {
          dateMiseEnService: {
            [Op.ne]: null,
          },
        },
      },
      { transaction }
    )

    if (entréesÀModifier.length > 0) {
      console.log(entréesÀModifier.length, ' entrées à modifier')
    } else {
      console.log('no entries, you can be cool')
    }
    // await queryInterface.changeColumn('users', 'état', {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // })
    // await queryInterface.sequelize.query(`drop type enum_users_état;`)
    // await queryInterface.changeColumn('users', 'état', {
    //   type: DataTypes.ENUM('invité', 'créé'),
    //   allowNull: true,
    // })
  },

  down: async (queryInterface: QueryInterface) => {
    // await queryInterface.changeColumn('users', 'état', {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // })
    // await queryInterface.sequelize.query(`drop type enum_users_état;`)
    // await queryInterface.changeColumn('users', 'état', {
    //   type: DataTypes.ENUM('invité'),
    //   allowNull: true,
    // })
  },
}

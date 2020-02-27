import { DataTypes } from 'sequelize'

export default function makeUserModel({ sequelize }) {
  return sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  })
}

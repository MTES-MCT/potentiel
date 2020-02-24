import { DataTypes } from 'sequelize'

export default function makeCredentialsModel({ sequelize }) {
  return sequelize.define('credentials', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}

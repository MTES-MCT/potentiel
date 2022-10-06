import { DataTypes } from 'sequelize'

export const MakeTacheDeFondModel = (sequelize) => {
  const TacheDeFond = sequelize.define(
    'tacheDeFond',
    {
      id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
      typeTache: { type: DataTypes.STRING, allowNull: false },
      utilisateurId: { type: DataTypes.UUID, allowNull: false },
      statut: { type: DataTypes.STRING, allowNull: false },
      dateDebut: { type: DataTypes.DATE, allowNull: false },
      dateFin: { type: DataTypes.DATE, allowNull: true },
      rapport: { type: DataTypes.JSON, allowNull: true },
    },
    { timestamps: true, freezeTableName: true }
  )

  TacheDeFond.associate = (models) => {
    const { User } = models
    TacheDeFond.belongsTo(User, { foreignKey: 'utilisateurId', as: 'utilisateur' })
  }

  return TacheDeFond
}

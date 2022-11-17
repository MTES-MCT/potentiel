import { UserRole } from '@modules/users'
import { sequelizeInstance } from '../../sequelize.config'
import { ConnexionsParRoleEtParJour } from '../sequelize/tableModels'
import { logger } from '@core/utils'

type mettreAJourConnexionsParJourEtParRoleProps = { role: UserRole; date: Date }

export const mettreAJourConnexionsParJourEtParRole = async ({
  role,
  date,
}: mettreAJourConnexionsParJourEtParRoleProps) => {
  const transaction = await sequelizeInstance.transaction()

  const entréeExistante = await ConnexionsParRoleEtParJour.findOne({
    where: { role, date },
    attributes: ['id', 'compteur'],
    transaction,
  })

  try {
    await ConnexionsParRoleEtParJour.upsert(
      {
        ...(entréeExistante && { id: entréeExistante.id }),
        compteur: entréeExistante ? (entréeExistante.compteur += 1) : 1,
        role,
        date,
      },
      { transaction }
    )
    await transaction.commit()
  } catch (e) {
    logger.error(e)
    await transaction.rollback()
  }
}

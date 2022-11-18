import { UserRole } from '@modules/users'
import { sequelizeInstance } from '../../sequelize.config'
import { ConnexionsParRoleEtParJour } from '../sequelize/tableModels'
import { logger } from '@core/utils'

type mettreAJourConnexionsParRoleEtParJourProps = { role: UserRole; date: Date }

export const mettreAJourConnexionsParRoleEtParJour = async ({
  role,
  date,
}: mettreAJourConnexionsParRoleEtParJourProps) => {
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
        compteur: entréeExistante?.compteur ? entréeExistante?.compteur + 1 : 1,
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

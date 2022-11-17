import { UserRole } from '@modules/users'
import { sequelizeInstance } from '../../sequelize.config'
import { ConnexionsParProjetEtParRoleParJour } from '../sequelize/tableModels'
import { logger } from '@core/utils'

type mettreAJourConnexionsParRoleEtParJourProps = { role: UserRole; date: Date; projet: string }

export const mettreAJourConnexionsParProjetEtParRoleParJour = async ({
  role,
  date,
  projet
}: mettreAJourConnexionsParRoleEtParJourProps) => {
  const transaction = await sequelizeInstance.transaction()

  const entréeExistante = await ConnexionsParProjetEtParRoleParJour.findOne({
    where: { role, date, projet },
    attributes: ['id', 'compteur'],
    transaction,
  })

  try {
    const compteur = entréeExistante ? (entréeExistante.compteur += 1) : 1
    await ConnexionsParProjetEtParRoleParJour.upsert(
      {
        ...(entréeExistante && { id: entréeExistante.id }),
        compteur,
        role,
        date,
        projet
      },
      { transaction }
    )
    await transaction.commit()
  } catch (e) {
    logger.error(e)
    await transaction.rollback()
  }
}
import { UserRole } from '@modules/users'
import { ConnexionsParProjetEtParRoleParJour } from '@infra/sequelize/tableModels'
import { logger } from '@core/utils'

import { sequelizeInstance } from '../../../sequelize.config'

type mettreAJourConnexionsParRoleEtParJourProps = { role: UserRole; date: Date; projet: string }

export const mettreAJourConnexionsParProjetEtParRoleParJour = async ({
  role,
  date,
  projet,
}: mettreAJourConnexionsParRoleEtParJourProps) => {
  const transaction = await sequelizeInstance.transaction()

  const entréeExistante = await ConnexionsParProjetEtParRoleParJour.findOne({
    where: { role, date, projet },
    attributes: ['id', 'compteur'],
    transaction,
  })

  try {
    await ConnexionsParProjetEtParRoleParJour.upsert(
      {
        ...(entréeExistante && { id: entréeExistante.id }),
        compteur: entréeExistante ? (entréeExistante.compteur += 1) : 1,
        role,
        date,
        projet,
      },
      { transaction }
    )
    await transaction.commit()
  } catch (e) {
    logger.error(e)
    await transaction.rollback()
  }
}

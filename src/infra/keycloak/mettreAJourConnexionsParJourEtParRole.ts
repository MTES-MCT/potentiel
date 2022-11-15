import { UserRole } from '@modules/users'
import { sequelizeInstance } from '../../sequelize.config'
import { format, parseISO } from 'date-fns'
import { ConnexionsParRoleEtParJour } from '../sequelize/tableModels'

type mettreAJourConnexionsParJourEtParRoleProps = { role: UserRole; date: Date }

export const mettreAJourConnexionsParJourEtParRole = async ({
  role,
  date,
}: mettreAJourConnexionsParJourEtParRoleProps) => {
  const transaction = await sequelizeInstance.transaction()
  const dateDuJour = format(parseISO(date.toISOString()), 'yyyy-MM-dd')

  const entréeExistante = await ConnexionsParRoleEtParJour.findOne({
    where: { role: 'admin', date: dateDuJour },
    attributes: ['id', 'compteur'],
    transaction,
  })

  if (entréeExistante) {
    try {
      await ConnexionsParRoleEtParJour.update(
        {
          compteur: (entréeExistante.compteur += 1),
        },
        { where: { id: entréeExistante.id }, transaction }
      )
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
    }
  } else {
    try {
      await ConnexionsParRoleEtParJour.create(
        {
          role,
          compteur: 1,
          date: dateDuJour,
        },
        { transaction }
      )
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
    }
  }
  return
}

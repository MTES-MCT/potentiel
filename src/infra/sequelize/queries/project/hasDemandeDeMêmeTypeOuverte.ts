import { wrapInfra } from '@core/utils'
import { HasDemandeDeMêmeTypeOuverte } from '@modules/project'
import { Op } from 'sequelize'
import models from '../../models'

const { ModificationRequest } = models

export const hasDemandeDeMêmeTypeOuverte: HasDemandeDeMêmeTypeOuverte = ({ projetId, type }) => {
  return wrapInfra(
    ModificationRequest.findOne({
      where: {
        projectId: projetId,
        type,
        status: {
          [Op.in]: [
            'envoyée',
            'en instruction',
            'information validée',
            'en attente de confirmation',
          ],
        },
      },
    })
  ).map((demandeOuverte: any) => demandeOuverte!!)
}

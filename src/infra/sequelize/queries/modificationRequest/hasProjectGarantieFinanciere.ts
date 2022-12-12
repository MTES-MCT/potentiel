import { wrapInfra } from '@core/utils'
import { HasProjectGarantieFinanciere } from '@modules/modificationRequest'
import models from '../../models'

const { GarantiesFinancières } = models

export const hasProjectGarantieFinanciere: HasProjectGarantieFinanciere = (projetId) => {
  return wrapInfra(
    GarantiesFinancières.findOne({
      where: { projetId, statut: ['à traiter', 'validé'] },
    })
  ).map((garantieFinanciere: any) => !!garantieFinanciere)
}

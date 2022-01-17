import { wrapInfra } from '../../../../core/utils'
import { HasProjectGarantieFinanciere } from '@modules/modificationRequest'
import models from '../../models'

const { ProjectStep } = models

export const hasProjectGarantieFinanciere: HasProjectGarantieFinanciere = (projectId) => {
  return wrapInfra(
    ProjectStep.findOne({
      where: { projectId, type: 'garantie-financiere' },
    })
  ).map((garantieFinanciere: any) => !!garantieFinanciere)
}

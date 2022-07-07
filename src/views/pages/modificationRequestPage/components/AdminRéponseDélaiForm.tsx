import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { format } from 'date-fns'
import React from 'react'
import { Input } from '../../../components'

type AdminRéponseDélaiFormProps = {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}

export const AdminRéponseDélaiForm = ({ modificationRequest }: AdminRéponseDélaiFormProps) => {
  const { project, delayInMonths, dateAchèvementDemandée } = modificationRequest
  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : delayInMonths
    ? new Date(
        new Date(project.completionDueOn).setMonth(
          new Date(project.completionDueOn).getMonth() + delayInMonths
        )
      )
    : null

  return (
    <div className="mt-4 mb-4">
      <label htmlFor="dateAchèvementAccordée">Date limite d'achèvement accordée</label>
      <Input
        type="date"
        name="dateAchèvementAccordée"
        id="dateAchèvementAccordée"
        {...(dateDemandée && {
          defaultValue: format(dateDemandée, 'yyyy-MM-dd'),
        })}
        required
      />
    </div>
  )
}

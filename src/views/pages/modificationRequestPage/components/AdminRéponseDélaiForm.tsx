import { Astérisque, Input } from '@components'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import format from 'date-fns/format'
import React from 'react'

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

  const nouvelleDateAchèvementMinimale = new Date(project.completionDueOn).setDate(
    new Date(project.completionDueOn).getDate() + 1
  )

  return (
    <div className="mt-4 mb-4">
      <label htmlFor="dateAchèvementAccordée">
        Date limite d'achèvement accordée <Astérisque />
      </label>
      <Input
        type="date"
        name="dateAchèvementAccordée"
        id="dateAchèvementAccordée"
        {...(dateDemandée && {
          defaultValue: format(dateDemandée, 'yyyy-MM-dd'),
        })}
        min={format(nouvelleDateAchèvementMinimale, 'yyyy-MM-dd')}
        required
        aria-required="true"
      />
    </div>
  )
}

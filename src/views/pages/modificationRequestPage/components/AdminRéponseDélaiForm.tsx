import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { Input } from '../../../components'
import { format } from 'date-fns'
interface AdminRéponseDélaiForm {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
export const AdminRéponseDélaiForm = ({ modificationRequest }: AdminRéponseDélaiForm) => {
  const { project, delayInMonths, dateAchèvementDemandée } = modificationRequest
  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : moment(project.completionDueOn).add(delayInMonths, 'month').toDate()

  return (
    <div className="mt-4 mb-4">
      {dateAchèvementDemandée && (
        <>
          <label htmlFor="dateAchèvementAccordée">Date limite d'achèvement accordée</label>
          <Input
            type="date"
            name="dateAchèvementAccordée"
            id="dateAchèvementAccordée"
            {...(dateAchèvementDemandée && {
              defaultValue: format(dateDemandée, 'yyyy-MM-dd'),
            })}
            required
          />
        </>
      )}
      {delayInMonths && (
        <div className="form__group mt-4 mb-4">
          <label htmlFor="delayInMonths">Délai accordé (en mois)</label>
          <input
            type="number"
            name="delayInMonths"
            id="delayInMonths"
            defaultValue={delayInMonths}
            data-initial-date={project.completionDueOn}
            {...dataId('delayInMonthsField')}
            style={{ width: 75 }}
          />
          <span style={{ marginLeft: 10 }} {...dataId('delayEstimateBox')}>
            {`Date d'achèvement projetée: ${formatDate(
              +moment(project.completionDueOn).add(delayInMonths, 'month')
            )}`}
          </span>
        </div>
      )}
    </div>
  )
}

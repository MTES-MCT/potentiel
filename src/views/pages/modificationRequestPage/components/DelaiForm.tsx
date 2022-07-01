import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { Input } from '../../../components'
import { format } from 'date-fns'
interface DelaiFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
export const DelaiForm = ({ modificationRequest }: DelaiFormProps) => {
  const { project, delayInMonths, dateAchèvementDemandée } = modificationRequest
  const dateDemandée = dateAchèvementDemandée
    ? new Date(dateAchèvementDemandée)
    : moment(project.completionDueOn).add(delayInMonths, 'month').toDate()

  return (
    <div className="mt-4 mb-4">
      {dateAchèvementDemandée && (
        <>
          <label htmlFor="dateAchèvementDemandée">Date d'achèvement demandée</label>
          <Input
            type="date"
            name="dateAchèvementDemandée"
            id="dateAchèvementDemandée"
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
            {`Date de mise en service projetée: ${formatDate(
              +moment(project.completionDueOn).add(delayInMonths, 'month')
            )}`}
          </span>
        </div>
      )}
    </div>
  )
}

import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
interface DelaiFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
export const DelaiForm = ({ modificationRequest }: DelaiFormProps) => {
  // @ts-ignore
  const { project, delayInMonths } = modificationRequest
  return (
    <>
      <div className="form__group mt-4 mb-4">
        <label htmlFor="delayInMonths">Délai accordé (en mois)</label>
        <input
          type="number"
          name="delayInMonths"
          id="delayInMonths"
          defaultValue={delayInMonths}
          data-initial-date={project.completionDueOn.getTime()}
          {...dataId('delayInMonthsField')}
          style={{ width: 75 }}
        />
        <span style={{ marginLeft: 10 }} {...dataId('delayEstimateBox')}>
          {`Date de mise en service projetée: ${formatDate(
            +moment(project.completionDueOn).add(delayInMonths, 'month')
          )}`}
        </span>
      </div>
    </>
  )
}

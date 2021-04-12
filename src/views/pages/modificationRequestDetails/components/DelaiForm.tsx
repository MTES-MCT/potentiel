import moment from 'moment'
import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import { DownloadResponseTemplate } from './DownloadResponseTemplate'

interface DelaiFormProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'delai' }
}
export const DelaiForm = ({ modificationRequest }: DelaiFormProps) => {
  const { project, delayInMonths } = modificationRequest
  return (
    <>
      <DownloadResponseTemplate modificationRequest={modificationRequest} />

      <div className="form__group">
        <label htmlFor="file">Réponse signée (fichier pdf)</label>
        <input type="file" name="file" id="file" />
      </div>

      <div className="form__group" style={{ marginTop: 5 }}>
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

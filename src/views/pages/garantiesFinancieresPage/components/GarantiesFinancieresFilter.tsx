import React from 'react'
import { refreshPageWithNewSearchParamValue } from '../../../helpers'

type GarantiesFinancieresFilterProps = { selectedValue: string }

export const GarantiesFinancieresFilter = (props: GarantiesFinancieresFilterProps) => {
  const { selectedValue = '' } = props
  const handleGarantiesFinancieresOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value: newValue },
    } = e
    refreshPageWithNewSearchParamValue('garantiesFinancieres', newValue)
  }

  return (
    <div className="navigation-tabs">
      <div className="tab">
        <input
          type="radio"
          name="garantiesFinancieres"
          id="garantiesFinancieres-toutes"
          value=""
          checked={selectedValue === ''}
          defaultChecked
          onChange={handleGarantiesFinancieresOnChange}
        />
        <label htmlFor="garantiesFinancieres-toutes">Toutes</label>
      </div>
      <div className="tab">
        <input
          type="radio"
          name="garantiesFinancieres"
          id="garantiesFinancieres-deposees"
          value="submitted"
          checked={selectedValue === 'submitted'}
          onChange={handleGarantiesFinancieresOnChange}
        />
        <label htmlFor="garantiesFinancieres-deposees">Déposées</label>
      </div>
      <div className="tab">
        <input
          type="radio"
          name="garantiesFinancieres"
          id="garantiesFinancieres-non-deposees"
          value="notSubmitted"
          checked={selectedValue === 'notSubmitted'}
          onChange={handleGarantiesFinancieresOnChange}
        />
        <label htmlFor="garantiesFinancieres-non-deposees">Non-déposées</label>
      </div>
      <div className="tab">
        <input
          type="radio"
          name="garantiesFinancieres"
          id="garantiesFinancieres-en-retard"
          value="pastDue"
          checked={selectedValue === 'pastDue'}
          onChange={handleGarantiesFinancieresOnChange}
        />
        <label htmlFor="garantiesFinancieres-en-retard">En retard</label>
      </div>
    </div>
  )
}

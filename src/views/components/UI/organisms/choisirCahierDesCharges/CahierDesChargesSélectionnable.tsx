import React from 'react'
import { CahierDesChargesRéférence } from '@entities'

type CahierDesChargesSelectionnableProps = {
  id: CahierDesChargesRéférence
  onCahierDesChargesChoisi?: (cahierDesChargesChoisi: CahierDesChargesRéférence) => void
  sélectionné: boolean
  désactivé?: true
}

export const CahierDesChargesSelectionnable: React.FC<CahierDesChargesSelectionnableProps> = ({
  id,
  sélectionné,
  désactivé,
  onCahierDesChargesChoisi,
  children,
}) => (
  <li className="relative">
    <input
      type="radio"
      name="choixCDC"
      value={id}
      id={id}
      checked={sélectionné}
      disabled={désactivé}
      onChange={() => onCahierDesChargesChoisi?.(id)}
      className="absolute top-1/2 left-3 peer"
    />
    <label
      htmlFor={id}
      className={`flex-1 border border-grey-925-base border-solid p-5 mb-5 pl-10 peer-checked:border-2 peer-checked:border-blue-france-sun-base hover:cursor-pointer peer-disabled:cursor-not-allowed
                  ${désactivé && 'text-grey-625-base'}`}
    >
      {children}
    </label>
  </li>
)

import React from 'react'

type CahierDesChargesSelectionnableProps = {
  id: string
  onCahierDesChargesChoisi: (cahierDesChargesChoisi: string) => void
  cdcChoisi: string
  désactivé?: true
}

export const CahierDesChargesSelectionnable: React.FC<CahierDesChargesSelectionnableProps> = ({
  id,
  cdcChoisi,
  désactivé,
  onCahierDesChargesChoisi,
  children,
}) => (
  <li className="inline-radio-option relative">
    <input
      type="radio"
      name="choixCDC"
      value={id}
      id={id}
      checked={cdcChoisi === id}
      disabled={désactivé}
      onChange={() => onCahierDesChargesChoisi(id)}
      className="peer absolute left-4"
    />
    <label
      htmlFor={id}
      className="flex-1 border border-gray-400 border-solid rounded p-5 mb-5 pl-10 peer-checked:border-2 peer-checked:border-blue-france-main-525-base peer-checked:bg-blue-france-975-base hover:cursor-pointer peer-disabled:cursor-not-allowed"
    >
      {children}
    </label>
  </li>
)

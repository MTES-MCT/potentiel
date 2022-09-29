import React from 'react'
import { CahierDesChargesRéférence } from '@entities'
import { RichRadio } from '@components'

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
  <RichRadio
    className="pr-6"
    name="choixCDC"
    value={id}
    id={id}
    checked={sélectionné}
    disabled={désactivé}
    onChange={() => onCahierDesChargesChoisi?.(id)}
  >
    {children}
  </RichRadio>
)

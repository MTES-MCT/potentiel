import React from 'react';
import { Radio } from '../../..';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type CahierDesChargesSelectionnableProps = {
  id: AppelOffre.CahierDesChargesRéférence;
  onCahierDesChargesChoisi?: (cahierDesChargesChoisi: AppelOffre.CahierDesChargesRéférence) => void;
  sélectionné: boolean;
  désactivé?: true;
  children: React.ReactNode;
};

export const CahierDesChargesSelectionnable: React.FC<CahierDesChargesSelectionnableProps> = ({
  id,
  sélectionné,
  désactivé,
  onCahierDesChargesChoisi,
  children,
}) => (
  <Radio
    className={`p-6 
                border
                border-solid   
              border-grey-925-base
              peer-checked:border-blue-france-sun-base
              peer-disabled:before:border-grey-625-base 
            `}
    name="choixCDC"
    value={id}
    id={id}
    checked={sélectionné}
    disabled={désactivé}
    onChange={() => onCahierDesChargesChoisi?.(id)}
  >
    {children}
  </Radio>
);

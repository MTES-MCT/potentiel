import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

type Props = {
  min: number;
  max: number;
};

export const InfoBoxDemandePuissance: FC<Props> = ({ min, max }) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Une autorisation est nécessaire si la modification de puissance est inférieure à{' '}
        {Math.round(min * 100)}% de la puissance initiale ou supérieure à {Math.round(max * 100)}%.
        Dans ce cas{' '}
        <strong>il est nécessaire de joindre un justificatif et une raison à votre demande</strong>.{' '}
      </div>
    }
  />
);

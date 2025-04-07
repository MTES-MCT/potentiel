import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

// texte présent dans l'AO
export const InfoBoxDemandePuissance: FC = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Le ratio ne doit pas dépasser 1.2 et ne doit pas être inférieur à 0.8
      </div>
    }
  />
);

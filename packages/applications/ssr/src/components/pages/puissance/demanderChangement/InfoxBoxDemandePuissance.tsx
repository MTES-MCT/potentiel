import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

// affichage information sur les ratios
// présent dans l'AO
export const InfoBoxDemandePuissance: FC = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Le ratio ne doit pas dépasser tant, ça sera donc une demande (et toc)
      </div>
    }
  />
);

import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

export const InfoBoxDemandeDélai: FC = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-1">
        Cette demande concerne les délais de <span className="font-semibold">force majeure</span>{' '}
        laissés à l’appréciation du préfet ou du ministre chargé de l’énergie, et{' '}
        <span className="font-semibold">non les délais pour contentieux ou raccordement</span> qui
        sont automatiquement attribués et vérifiés a posteriori par le co-contractant.
      </div>
    }
  />
);

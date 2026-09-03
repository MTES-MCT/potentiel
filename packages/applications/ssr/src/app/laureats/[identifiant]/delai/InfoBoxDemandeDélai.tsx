import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

export const InfoBoxDemandeDélai: FC = () => (
  <Notice
    severity="info"
    title=""
    description={
      <span >
        Cette demande concerne les délais de <span className="font-semibold">force majeure</span>{' '}
        laissés à l’appréciation du préfet ou du ministre chargé de l’énergie, et{' '}
        <span className="font-semibold">non les délais pour contentieux ou raccordement</span> qui
        sont automatiquement attribués et vérifiés a posteriori par le Cocontractant.
      </span>
    }
  />
);

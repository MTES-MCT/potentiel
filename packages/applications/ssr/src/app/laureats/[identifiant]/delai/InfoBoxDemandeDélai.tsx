import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

export const InfoBoxDemandeDélai: FC = () => (
  <Notice
    severity="info"
    title="Cette demande concerne les délais de force majeure laissés à l’appréciation du préfet ou du ministre chargé de l’énergie"
    description={
      <span>
        <br />
        Elle ne concerne pas les délais pour contentieux ou raccordement qui sont automatiquement
        attribués et vérifiés a posteriori par le Cocontractant.
      </span>
    }
  />
);

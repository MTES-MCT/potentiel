import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

type Props = {
  motif: Lauréat.Délai.MotifDemandeDélai.RawType;
  className?: string;
};

const textMap: Record<
  Lauréat.Délai.MotifDemandeDélai.RawType,
  { title: string; description: React.ReactNode }
> = {
  'prolongation-délai-achèvement': {
    title: `Cette demande concerne les délais de force majeure laissés à l'appréciation du préfet ou du ministre chargé de l'énergie`,
    description: (
      <>
        Elle ne concerne pas les délais pour contentieux ou raccordement qui sont automatiquement
        attribués et vérifiés a posteriori par le Cocontractant.
      </>
    ),
  },
  'prolongation-phase-essai': {
    title: "Cette demande concerne un délai pour prolongation de phase d'essai.",
    description: (
      <>
        Son instruction est soumise au ministre chargé de l'énergie.
        <br />
        <span className="font-semibold">
          Son accord n'aura pas d'impact sur la date d'achèvement prévisionnel affichée sur
          Potentiel.
        </span>
      </>
    ),
  },
};
export const InfoBoxDemandeDélai: FC<Props> = ({ motif, className }) => (
  <Notice
    severity="info"
    title={textMap[motif].title}
    className={className}
    description={
      <span>
        <br />
        {textMap[motif].description}
      </span>
    }
  />
);

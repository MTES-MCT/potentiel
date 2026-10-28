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
    title: `Cette demande concerne les prolongations des délais d'achèvement laissés à l'appréciation du Préfet ou du Ministre chargé de l'énergie`,
    description: (
      <>
        Elle ne concerne pas les délais pour contentieux ou raccordement qui sont automatiquement
        attribués et vérifiés a posteriori par le Cocontractant.
        <br />
        <span className="font-semibold">
          Son accord impactera la date d'achèvement prévisionnel affichée sur Potentiel.
        </span>
      </>
    ),
  },
  'prolongation-phase-essai': {
    title:
      'Cette demande concerne un délai de prolongation des phases d’essais préalables à la prise d’effet du contrat de complément de rémunération',
    description: (
      <>
        Son instruction est soumise au Ministre chargé de l'énergie.
        <br />
        <span className="font-semibold">
          Ce délai n'impacte pas la date d'achèvement prévisionnel affichée sur Potentiel.
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

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  estProjetAchevé: boolean;
};

export const DétailsRaccordementDuProjetPage = ({ identifiantProjet, estProjetAchevé }: Props) => {
  return (
    <>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4 flex flex-col gap-4">
        <div className="md:w-1/2">
          <GestionnaireRéseauSection identifiantProjet={identifiantProjet} />
        </div>
        <DossiersRaccordementSection
          identifiantProjet={identifiantProjet}
          estProjetAchevé={estProjetAchevé}
        />
      </div>
    </>
  );
};

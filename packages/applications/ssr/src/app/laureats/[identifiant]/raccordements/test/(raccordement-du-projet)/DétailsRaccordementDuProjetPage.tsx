import Button from '@codegouvfr/react-dsfr/Button';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  lienRetour: string;
  estProjetAchevé: boolean;
};

export const DétailsRaccordementDuProjetPage = ({
  identifiantProjet,
  lienRetour,
  estProjetAchevé,
}: Props) => {
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
        <Button
          priority="secondary"
          linkProps={{ href: lienRetour }}
          iconId="fr-icon-arrow-left-line"
        >
          Retour
        </Button>
      </div>
    </>
  );
};

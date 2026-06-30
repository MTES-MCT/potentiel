import Button from '@codegouvfr/react-dsfr/Button';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  lienRetour: string;
  statut: Lauréat.StatutLauréat.RawType;
};

export const DétailsRaccordementDuProjetPage = ({
  identifiantProjet,
  lienRetour,
  statut,
}: Props) => {
  return (
    <>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4 flex flex-col gap-4">
        <div className="w-fit">
          <GestionnaireRéseauSection identifiantProjet={identifiantProjet} />
        </div>
        <DossiersRaccordementSection identifiantProjet={identifiantProjet} statut={statut} />
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

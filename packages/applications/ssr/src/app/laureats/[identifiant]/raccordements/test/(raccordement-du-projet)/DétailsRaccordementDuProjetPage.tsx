import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';
import { GestionnaireRéseauSection } from './GestionnaireRéseau.section';

type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
  lienRetour: string;
};

export const DétailsRaccordementDuProjetPage = ({ identifiantProjet, lienRetour }: Props) => {
  // FAKE PROPS
  const créerNouveauDossier = true;

  return (
    <>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4 flex flex-col gap-4">
        <div className="flex flex-row items-start gap-8">
          <GestionnaireRéseauSection identifiantProjet={identifiantProjet} />
          {créerNouveauDossier && (
            <Alert
              severity="info"
              small
              className="flex-1"
              description={
                <div className="p-3">
                  Si le raccordement comporte plusieurs points d'injection, vous devez ajouter un
                  nouveau dossier de raccordement.
                </div>
              }
            />
          )}
        </div>
        <DossiersRaccordementSection identifiantProjet={identifiantProjet} />
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

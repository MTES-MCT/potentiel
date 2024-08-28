import Link from 'next/link';
import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';
import { GestionnaireRéseau } from './type';

export type AucunDossierDeRaccordementProps = {
  identifiantProjet: string;
  gestionnaireRéseau?: GestionnaireRéseau;
};

export const AucunDossierDeRaccordementPage: FC<AucunDossierDeRaccordementProps> = ({
  identifiantProjet,
  gestionnaireRéseau,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageRaccordement />

    <div className="flex flex-col gap-8">
      {gestionnaireRéseau && (
        <ModifierGestionnaireRéseauDuRaccordement
          gestionnaireRéseau={gestionnaireRéseau}
          identifiantProjet={identifiantProjet}
        />
      )}
      <p>
        Aucun dossier de raccordement trouvé pour ce projet, vous devez transmettre un{' '}
        <Link
          href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet)}
          className="font-semibold"
        >
          nouveau dossier de raccordement
        </Link>
      </p>
      <Button
        priority="secondary"
        linkProps={{ href: Routes.Projet.details(identifiantProjet), prefetch: false }}
        className="mt-4"
        iconId="fr-icon-arrow-left-line"
      >
        Retour vers le projet
      </Button>
    </div>
  </PageTemplate>
);

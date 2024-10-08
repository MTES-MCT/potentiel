import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { GestionnaireRéseau as GestionnaireRéseauProps } from './type';
import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';
import { AucunDossierDeRaccordementAlert } from './AucunDossierDeRaccordementAlert';

export type AucunDossierDeRaccordementPageProps = {
  identifiantProjet: string;
  gestionnaireRéseau?: GestionnaireRéseauProps;
};

export const AucunDossierDeRaccordementPage: FC<AucunDossierDeRaccordementPageProps> = ({
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
      <AucunDossierDeRaccordementAlert identifiantProjet={identifiantProjet} />
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

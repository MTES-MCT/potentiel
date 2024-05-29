import Link from 'next/link';
import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

import { ModifierGestionnaireRéseauDuRaccordement } from './components/ModifierGestionnaireRéseauDuRaccordement';
import { GestionnaireRéseau } from './type';

export type AucunDossierDeRaccordementProps = {
  projet: ProjetBannerProps;
  gestionnaireRéseau?: GestionnaireRéseau;
};

export const AucunDossierDeRaccordementPage: FC<AucunDossierDeRaccordementProps> = ({
  projet,
  gestionnaireRéseau,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageRaccordement />

    <div className="flex flex-col gap-8">
      {gestionnaireRéseau && (
        <ModifierGestionnaireRéseauDuRaccordement
          gestionnaireRéseau={gestionnaireRéseau}
          identifiantProjet={projet.identifiantProjet}
        />
      )}
      <p>
        Aucun dossier de raccordement trouvé pour ce projet, vous pouvez transmettre une{' '}
        <Link
          href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(
            projet.identifiantProjet,
          )}
          className="font-semibold"
        >
          nouvelle demande complète de raccordement
        </Link>
      </p>
      <Button
        priority="secondary"
        linkProps={{ href: Routes.Projet.details(projet.identifiantProjet) }}
        className="mt-4"
        iconId="fr-icon-arrow-left-line"
      >
        Retour vers le projet
      </Button>
    </div>
  </PageTemplate>
);

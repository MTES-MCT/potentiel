import Link from 'next/link';
import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageRaccordement } from '../TitrePageRaccordement';

export type AucunDossierDeRaccordementProps = {
  projet: ProjetBannerProps;
};

export const AucunDossierDeRaccordementPage: FC<AucunDossierDeRaccordementProps> = ({ projet }) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageRaccordement />

    <div className="flex flex-col gap-8">
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

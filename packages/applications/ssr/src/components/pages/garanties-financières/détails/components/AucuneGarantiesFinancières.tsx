import { FC } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

type AucuneGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  action?: 'soumettre';
};

export const AucuneGarantiesFinancières: FC<AucuneGarantiesFinancièresProps> = ({
  projet,
  action,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageGarantiesFinancières />

    <div className="flex flex-col gap-8">
      <p>Aucune garanties financières pour ce projet.</p>

      {action === 'soumettre' && (
        <p>
          Vous pouvez en soumettre en{' '}
          <Link
            href={Routes.GarantiesFinancières.soumettre(projet.identifiantProjet)}
            className="font-semibold"
          >
            suivant ce lien
          </Link>
        </p>
      )}

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

'use client';

import React, { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-libraries/routes';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { CallOut } from '@/components/atoms/CallOut';

export type ProjetADéjàUnDépôtEnCoursProps = {
  projet: ProjetBannerProps;
};

export const ProjetADéjàUnDépôtEnCoursPage: FC<ProjetADéjàUnDépôtEnCoursProps> = ({ projet }) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <CallOut
      iconId="ri-information-line"
      title="Garanties financières en attente de validation"
      content={
        <>
          <p>
            Vous avez déjà soumis des garanties financières en attente de validation pour ce projet.
            Si vous souhaitez soumettre de nouvelles garanties financières, vous devez d'abord
            supprimer celles en attente.
          </p>
          <Button
            linkProps={{ href: Routes.GarantiesFinancières.détail(projet.identifiantProjet) }}
            className="mt-4"
          >
            Voir
          </Button>
        </>
      }
    />
  </PageTemplate>
);

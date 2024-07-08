import React, { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { CallOut } from '@/components/atoms/CallOut';

export type ProjetADéjàUnDépôtEnCoursProps = {
  identifiantProjet: string;
};

export const ProjetADéjàUnDépôtEnCoursPage: FC<ProjetADéjàUnDépôtEnCoursProps> = ({
  identifiantProjet,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
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
            linkProps={{ href: Routes.GarantiesFinancières.détail(identifiantProjet) }}
            className="mt-4"
          >
            Voir
          </Button>
        </>
      }
    />
  </PageTemplate>
);

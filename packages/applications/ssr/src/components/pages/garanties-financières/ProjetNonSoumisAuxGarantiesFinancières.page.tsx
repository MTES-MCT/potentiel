import { FC } from 'react';
import CallOut from '@codegouvfr/react-dsfr/CallOut';

import { Routes } from '@potentiel-applications/routes';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

export type ProjetNonSoumisAuxGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const ProjetNonSoumisAuxGarantiesFinancièresPage: FC<
  ProjetNonSoumisAuxGarantiesFinancièresProps
> = ({ identifiantProjet }) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <CallOut
      buttonProps={{
        children: 'Retourner au projet',
        linkProps: {
          href: Routes.Projet.details(identifiantProjet),
        },
      }}
      iconId="ri-information-line"
      title="Projet non soumis aux garanties financières"
      className="mt-4"
    >
      Le projet n'est pas soumis aux garanties financières.
    </CallOut>
  </PageTemplate>
);

import { FC } from 'react';
import CallOut from '@codegouvfr/react-dsfr/CallOut';

import { Routes } from '@potentiel-libraries/routes';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

export type ProjetNonSoumisAuxGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
};

export const ProjetNonSoumisAuxGarantiesFinancièresPage: FC<
  ProjetNonSoumisAuxGarantiesFinancièresProps
> = ({ projet }) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <CallOut
      buttonProps={{
        children: 'Retourner au projet',
        linkProps: {
          href: Routes.Projet.details(projet.identifiantProjet),
        },
      }}
      iconId="ri-information-line"
      title="Projet non soumis aux garanties financières"
      className="mt-4"
    >
      Le projet <span className="font-semibold">{projet.nom}</span> n'est pas soumis aux garanties
      financières.
    </CallOut>
  </PageTemplate>
);

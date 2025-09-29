import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { ModifierSiteDeProductionForm } from './ModifierSiteDeProduction.form';

export type ModifierSiteDeProductionPageProps = {
  lauréat: PlainType<Lauréat.ConsulterLauréatReadModel>;
};

export const ModifierSiteDeProductionPage: React.FC<ModifierSiteDeProductionPageProps> = ({
  lauréat,
}) => {
  const identifiantProjet = IdentifiantProjet.bind(lauréat.identifiantProjet);

  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet.formatter()} />}
      heading={<Heading1>Modifier le site de production</Heading1>}
      leftColumn={{
        children: (
          <ModifierSiteDeProductionForm
            identifiantProjet={lauréat.identifiantProjet}
            localité={lauréat.localité}
          />
        ),
      }}
      rightColumn={{ children: <></> }}
    />
  );
};

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import {
  ModifierSiteDeProductionForm,
  ModifierSiteDeProductionFormProps,
} from './ModifierSiteDeProduction.form';

export type ModifierSiteDeProductionPageProps = ModifierSiteDeProductionFormProps;

export const ModifierSiteDeProductionPage: React.FC<ModifierSiteDeProductionPageProps> = ({
  lauréat,
  rôle,
}) => {
  const identifiantProjet = IdentifiantProjet.bind(lauréat.identifiantProjet);

  return (
    <ColumnPageTemplate
      banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet.formatter()} />}
      heading={<Heading1>Modifier le site de production</Heading1>}
      leftColumn={{
        children: <ModifierSiteDeProductionForm lauréat={lauréat} rôle={rôle} />,
      }}
      rightColumn={{ children: <></> }}
    />
  );
};

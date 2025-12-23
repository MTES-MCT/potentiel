import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  ModifierSiteDeProductionForm,
  ModifierSiteDeProductionFormProps,
} from './ModifierSiteDeProduction.form';

export type ModifierSiteDeProductionPageProps = ModifierSiteDeProductionFormProps;

export const ModifierSiteDeProductionPage: React.FC<ModifierSiteDeProductionPageProps> = ({
  lauréat,
  rôle,
}) => {
  return (
    <ColumnPageTemplate
      heading={<Heading1>Modifier le site de production</Heading1>}
      leftColumn={{
        children: <ModifierSiteDeProductionForm lauréat={lauréat} rôle={rôle} />,
      }}
      rightColumn={{ children: <></> }}
    />
  );
};

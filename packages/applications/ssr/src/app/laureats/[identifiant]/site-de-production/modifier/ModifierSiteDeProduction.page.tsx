import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  ModifierSiteDeProductionForm,
  type ModifierSiteDeProductionFormProps,
} from './ModifierSiteDeProduction.form';

export type ModifierSiteDeProductionPageProps = ModifierSiteDeProductionFormProps;

export const ModifierSiteDeProductionPage: React.FC<ModifierSiteDeProductionPageProps> = ({
  lauréat,
  rôle,
}) => (
  <PageTemplate>
    <Heading1>Modifier le site de production</Heading1>
    <ModifierSiteDeProductionForm lauréat={lauréat} rôle={rôle} />
  </PageTemplate>
);

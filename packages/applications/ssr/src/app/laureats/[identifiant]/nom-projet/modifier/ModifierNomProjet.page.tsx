import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ModifierNomProjetForm, ModifierNomProjetFormProps } from './ModifierNomProjet.form';

export type ModifierNomProjetPageProps = ModifierNomProjetFormProps;

export const ModifierNomProjetPage: React.FC<ModifierNomProjetPageProps> = ({
  identifiantProjet,
  nomProjet,
}) => {
  return (
    <ColumnPageTemplate
      heading={<Heading1>Modifier le nom du projet</Heading1>}
      leftColumn={{
        children: (
          <ModifierNomProjetForm nomProjet={nomProjet} identifiantProjet={identifiantProjet} />
        ),
      }}
      rightColumn={{ children: <></> }}
    />
  );
};

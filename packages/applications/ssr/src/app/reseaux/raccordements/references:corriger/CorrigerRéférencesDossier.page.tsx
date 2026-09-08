import Notice from '@codegouvfr/react-dsfr/Notice';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';
import { CorrigerRéférencesDossierForm } from './CorrigerRéférencesDossier.form';

export const CorrigerRéférencesDossierPage = () => (
  <PageTemplate banner={<Heading1>Corriger des références dossier</Heading1>}>
    <ColumnPageTemplate
      leftColumn={{
        children: <CorrigerRéférencesDossierForm />,
      }}
      rightColumn={{
        children: (
          <Notice
            severity="info"
            title="Résumé du tableau attendu pour la correction des références de raccordement"
            description={
              <Table
                className="lg:mx-4 my-4 border-spacing-0"
                headers={['Colonne', 'Format']}
                data={[
                  ['identifiantProjet', 'chaîne de caractères'],
                  ['referenceDossier', 'chaîne de caractères'],
                  ['referenceDossierCorrigee', 'chaîne de caractères'],
                ]}
              />
            }
          />
        ),
      }}
    />
  </PageTemplate>
);

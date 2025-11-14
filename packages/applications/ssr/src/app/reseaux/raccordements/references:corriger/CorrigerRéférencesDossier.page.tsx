import Alert from '@codegouvfr/react-dsfr/Alert';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { PageTemplate } from '@/components/templates/Page.template';

import { CorrigerRéférencesDossierForm } from './CorrigerRéférencesDossier.form';

export const CorrigerRéférencesDossierPage = () => (
  <PageTemplate
    banner={<Heading1 className="text-theme-white">Corriger des références dossier</Heading1>}
  >
    <ColumnPageTemplate
      leftColumn={{
        children: <CorrigerRéférencesDossierForm />,
      }}
      rightColumn={{
        children: (
          <Alert
            severity="info"
            small
            description={
              <div className="py-4 text-justify">
                <Table
                  className="lg:mx-4 my-4 border-spacing-0"
                  caption="Résumé du tableau attendu pour la correction des références de raccordement"
                  headers={['Colonne', 'Format']}
                  data={[
                    ['identifiantProjet', 'chaîne de caractères'],
                    ['referenceDossier', 'chaîne de caractères'],
                    ['referenceDossierCorrigee', 'chaîne de caractères'],
                  ]}
                />
              </div>
            }
          />
        ),
      }}
    />
  </PageTemplate>
);

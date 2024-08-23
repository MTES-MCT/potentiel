import Alert from '@codegouvfr/react-dsfr/Alert';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { CorrigerRéférenceDossierForm } from './CorrigerRéférenceDossier.form';

export const CorrigerRéférenceDossierPage = () => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Corriger des références dossier</Heading1>}
    leftColumn={{
      children: <CorrigerRéférenceDossierForm />,
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
                caption="Résumé du tableau attendu pour la des références de raccordement"
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
);

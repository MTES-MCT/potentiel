import Alert from '@codegouvfr/react-dsfr/Alert';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ImporterDatesMiseEnServiceForm } from './importerDatesMiseEnService.form';

export const ImporterDatesMiseEnServicePage = () => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des dates de mise en service</Heading1>}
    leftColumn={{
      children: <ImporterDatesMiseEnServiceForm />,
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
                caption="Résumé du tableau attendu pour l'import des dates de mise en service"
                headers={['Colonne', 'Format']}
                data={[
                  ['referenceDossier', 'chaîne de caractères'],
                  ['dateMiseEnService', 'date au format JJ/MM/AAAA'],
                ]}
              />
            </div>
          }
        />
      ),
    }}
  />
);

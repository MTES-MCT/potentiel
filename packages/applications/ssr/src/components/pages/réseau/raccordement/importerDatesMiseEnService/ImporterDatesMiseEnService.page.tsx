'use client';

import { useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Table } from '@codegouvfr/react-dsfr/Table';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { importerDatesMiseEnServiceAction } from './importDatesMiseEnService.action';

export const ImporterDatesMiseEnServicePage = () => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ColumnPageTemplate
      banner={
        <Heading1 className="text-theme-white">Importer des dates de mise en service</Heading1>
      }
      leftColumn={{
        children: (
          <Form
            method="post"
            encType="multipart/form-data"
            action={importerDatesMiseEnServiceAction}
            heading="Importer des dates de mise en service"
            pendingModal={{
              id: 'form-import-date-mise-en-service',
              title: 'Import en cours',
              children: 'Import des dates de mise en service en cours ...',
            }}
            onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          >
            <UploadDocument
              label="Fichier des dates de mise en service"
              format="csv"
              name="fichierDatesMiseEnService"
              required
              state={validationErrors.includes('fichierDatesMiseEnService') ? 'error' : 'default'}
            />
            <div className="flex flex-col md:flex-row mx-auto">
              <SubmitButton>Importer</SubmitButton>
            </div>
          </Form>
        ),
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
                    ['referenceDossierCorrigee', 'chaîne de caractères (optionnel)'],
                  ]}
                />
              </div>
            }
          />
        ),
      }}
    />
  );
};

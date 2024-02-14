'use client';

import { useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { importerDatesMiseEnServiceAction } from './importDatesMiseEnService.action';

export const ImporterDatesMiseEnServicePage = () => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <ColumnPageTemplate
      banner={<Heading1 className="text-white">Importer des dates de mise en service</Heading1>}
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
            <Upload
              label="Fichier des dates de mise en service"
              hint='Format supporté : ".csv"'
              nativeInputProps={{
                name: 'fichierDatesMiseEnService',
                accept: '.csv',
                required: true,
                'aria-required': true,
              }}
              state={validationErrors.includes('fichierDatesMiseEnService') ? 'error' : 'default'}
              stateRelatedMessage={'Vous devez joindre un fichier non vide.'}
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
                <table className="lg:mx-4 my-4 border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                        scope="col"
                      >
                        Colonne
                      </th>
                      <th
                        className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                        scope="col"
                      >
                        Format
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-grey-950-base">
                    <tr className="odd:bg-grey-975-base">
                      <td className="text-left p-4">referenceDossier</td>
                      <td className="text-left p-4">chaîne de caractères</td>
                    </tr>
                    <tr className="odd:bg-grey-975-base">
                      <td className="text-left p-4">dateMiseEnService</td>
                      <td className="text-left p-4">date au format JJ/MM/AAAA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
          />
        ),
      }}
    />
  );
};

import { Upload } from '@codegouvfr/react-dsfr/Upload';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Heading1 } from '@/components/atoms/headings';
import { FormPageTemplate } from '@/components/templates/FormPageTemplate';

import { importerDatesMiseEnServiceAction } from './importDatesMiseEnService.action';

export const ImporterDatesMiseEnServicePage = () => {
  return (
    <FormPageTemplate
      heading={<Heading1 className="text-white">Importer des dates de mise en service</Heading1>}
      form={
        <Form method="post" encType="multipart/form-data" action={importerDatesMiseEnServiceAction}>
          <Upload
            label="Fichier des dates de mise en service"
            hint='Format supporté : ".csv"'
            nativeInputProps={{
              name: 'fichierDatesMiseEnService',
              accept: '.csv',
              required: true,
              'aria-required': true,
            }}
          />
          <div className="flex flex-col md:flex-row mx-auto">
            <SubmitButton>Importer</SubmitButton>
          </div>
        </Form>
      }
      information={{
        title: 'Format du fichier CSV attendu',
        description: (
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
        ),
      }}
    />
  );
};

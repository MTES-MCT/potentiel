// import { Spinner } from '@/components/atoms/Spinner';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { Heading1 } from '@/components/atoms/headings';
import { FormPageTemplate } from '@/components/templates/FormPageTemplate';
// import Alert from '@codegouvfr/react-dsfr/Alert';
// import { createModal } from '@codegouvfr/react-dsfr/Modal';
// import React, { FC, useState } from 'react';
import { importerDatesMiseEnServiceAction } from './importDatesMiseEnService.action';
import { FC } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';

export type CsvError = {
  numéroLigne?: number;
  valeurInvalide?: string;
  raison: string;
};

type Réussi = {
  référenceDossier: string;
  statut: 'réussi';
};
type Échec = {
  référenceDossier: string;
  statut: 'échec';
  raison: string;
};
type Résultat = Réussi | Échec;

type ImporterDatesMiseEnServiceProps = {
  résultatImport?: ReadonlyArray<Résultat>;
  csvErrors: ReadonlyArray<CsvError>;
};

export const ImporterDatesMiseEnServicePage: FC<ImporterDatesMiseEnServiceProps> = (
  {
    // résultatImport,
    // csvErrors,
  },
) => {
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
    >
      <></>
      {/* <div className="flex flex-col md:flex-row gap-4 justify-between">
        {isImportInProgress && (
          <modal.Component title="import en cours">
            <div className="flex flex-col text-center m-0 p-0">
              <div className="mx-auto mb-5">
                <Spinner size="large" />
              </div>
              Import en cours
            </div>

            <p className="italic text-center">
              Ce traitement peut prendre jusqu'à 2 minutes, merci de patienter 🙏
            </p>
          </modal.Component>
        )}
      </div> */}
      {/* 
      {csvErrors.length > 0 && (
        <Alert
          severity="error"
          small
          title="Le fichier CSV n'est pas valide"
          description={
            <ul>
              {csvErrors.map(({ numéroLigne, valeurInvalide, raison }) => (
                <li key={`csv-error-line-${numéroLigne}`} className="ml-3">
                  Ligne {numéroLigne} : {raison}
                  {valeurInvalide && `[${valeurInvalide}]`}
                </li>
              ))}
            </ul>
          }
        />
      )} */}
      {/* 
      {importsRéussis.length > 0 && (
        <>
          <Alert
            severity="success"
            small
            title={`${importsRéussis.length} projet${
              importsRéussis.length === 1 ? ' a' : 's ont'
            } été mis à jour`}
            description={<></>}
          />
        </>
      )}

      {importsÉchoués.length > 0 && (
        <Alert
          severity="error"
          small
          title={`${importsÉchoués.length} import${
            importsÉchoués.length === 1 ? ` n'a` : `s n'ont`
          } pas abouti`}
          description={
            <ul>
              {importsÉchoués.map(({ raison, référenceDossier }) => (
                <li key={`import-échoué-${référenceDossier}`}>
                  {raison} [<span className="font-bold">{référenceDossier}</span>]
                </li>
              ))}
            </ul>
          }
        />
      )} */}
    </FormPageTemplate>
  );
};

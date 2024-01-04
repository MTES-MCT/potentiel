import React from 'react';
import { Request } from 'express';
import {
  PrimaryButton,
  ErrorBox,
  Heading1,
  Input,
  Label,
  LegacyPageTemplate,
  SuccessBox,
  Form,
} from '../components';
import { hydrateOnClient } from '../helpers';

import { GET_IMPORT_CANDIDATS } from '@potentiel/legacy-routes';

type AdminImporterCandidatsProps = {
  request: Request;
  importErrors?: Record<number, string>;
  otherError?: string;
  isSuccess?: boolean;
};

export const AdminImporterCandidats = ({
  request,
  importErrors,
  isSuccess,
  otherError,
}: AdminImporterCandidatsProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="import-projects">
      <Heading1>Importer des candidats</Heading1>
      <Form
        action={GET_IMPORT_CANDIDATS}
        method="post"
        encType="multipart/form-data"
        className="mx-auto"
      >
        {isSuccess && <SuccessBox title="Les projets ont bien été importés." />}
        {!!importErrors && (
          <ErrorBox title="Le fichier n'a pas pu être importé à cause des erreurs suivantes :">
            <ul>
              {Object.entries(importErrors).map(([lineNumber, message]) => (
                <li key={`error_line_${lineNumber}`}>
                  Ligne <b>{lineNumber}</b>: {message}
                </li>
              ))}
            </ul>
          </ErrorBox>
        )}

        {!!otherError && <ErrorBox title={otherError} className="mb-3" />}

        <div>
          <Label htmlFor="candidats">Fichier csv des candidats</Label>
          <Input type="file" name="candidats" id="candidats" required accept=".csv" />
        </div>
        <PrimaryButton type="submit" name="submit" id="submit">
          Envoyer
        </PrimaryButton>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminImporterCandidats);

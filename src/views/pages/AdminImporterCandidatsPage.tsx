import React from 'react';
import ROUTES from '@routes';
import { Request } from 'express';
import {
  PrimaryButton,
  ErrorBox,
  Heading1,
  Input,
  Label,
  LegacyPageTemplate,
  SuccessBox,
} from '@components';
import { hydrateOnClient } from '../helpers';

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
      <div className="panel">
        <div className="panel__header">
          <Heading1>Importer des candidats</Heading1>
        </div>
        <form action={ROUTES.IMPORT_PROJECTS_ACTION} method="post" encType="multipart/form-data">
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

          <div className="form__group">
            <Label htmlFor="candidats">Fichier csv des candidats</Label>
            <Input type="file" name="candidats" id="candidats" required />
            <PrimaryButton type="submit" name="submit" id="submit" className="mt-2">
              Envoyer
            </PrimaryButton>
          </div>
        </form>
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(AdminImporterCandidats);

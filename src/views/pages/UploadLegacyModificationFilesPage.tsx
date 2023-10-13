import type { Request } from 'express';
import React from 'react';
import ROUTES from '../../routes';
import { ErrorBox, PrimaryButton, SuccessBox, Heading1, Label, Input, Form } from '@potentiel/ui';
import { LegacyPageTemplate } from '../components';
import { hydrateOnClient } from '../helpers/hydrateOnClient';

export type UploadLegacyModificationFileResult =
  | {
      filename: string;
    } & ({ error: false } | { error: true; message: string });

type UploadLegacyModificationFilesProps = {
  request: Request;
  results?: UploadLegacyModificationFileResult[];
};

export const UploadLegacyModificationFiles = ({
  request,
  results,
}: UploadLegacyModificationFilesProps) => {
  const {
    query: { error },
  } = request;

  const errors =
    results?.filter(
      (result): result is UploadLegacyModificationFileResult & { error: true } => result.error,
    ) || [];
  const successes = results?.filter((result) => !result.error) || [];

  return (
    <LegacyPageTemplate user={request.user} currentPage={'admin-upload-legacy-modification-files'}>
      <Heading1>Importer des courriers historiques</Heading1>

      {error && <ErrorBox title={error as string} />}

      {errors.length > 0 && (
        <ErrorBox title="Erreurs :">
          <ul className="pl-3 mb-0 mt-1">
            {errors.map((result) => (
              <li key={`result_for_${result.filename}`} className="mb-1">
                <div>{result.filename}</div>
                <div className="text-sm">{result.message}</div>
              </li>
            ))}
          </ul>
        </ErrorBox>
      )}
      {successes.length > 0 && (
        <SuccessBox
          title={`${successes.length} courrier${successes.length > 1 && 's'} rattaché${
            successes.length > 1 && 's'
          } avec succès`}
        />
      )}

      <Form
        action={ROUTES.UPLOAD_LEGACY_MODIFICATION_FILES}
        method="post"
        encType="multipart/form-data"
      >
        <div>
          <Label htmlFor="files">
            Sélectionner les fichiers à attacher aux demandes historiques.
          </Label>
          <div className="text-sm mt-1 mb-2">
            <b>Attention</b>: seuls les fichiers mentionnés dans un colonne 'Nom courrier [N]'
            pourront être associés.
          </div>
          <Input type="file" multiple name="files" id="files" />
          <div className="text-sm mt-2">
            Vous pouvez attacher jusqu'à 50Mo de fichiers à la fois
          </div>
        </div>
        <PrimaryButton type="submit" name="submit" id="submit">
          Envoyer
        </PrimaryButton>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(UploadLegacyModificationFiles);

import type { Request } from 'express';
import React from 'react';
import { dataId } from '../../helpers/testId';
import ROUTES from '@routes';
import { ErrorBox, Button, PageTemplate, SuccessBox, Heading1, Label, Input } from '@components';
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
    <PageTemplate user={request.user} currentPage={'admin-upload-legacy-modification-files'}>
      <div className="panel">
        <div className="panel__header">
          <Heading1>Importer des courriers historiques</Heading1>
        </div>

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

        <form
          action={ROUTES.UPLOAD_LEGACY_MODIFICATION_FILES}
          method="post"
          encType="multipart/form-data"
        >
          <Label htmlFor="files">
            Sélectionner les fichiers à attacher aux demandes historiques.
          </Label>
          <div className="text-sm mt-1 mb-2">
            <b>Attention</b>: seuls les fichiers mentionnés dans un colonne 'Nom courrier [N]'
            pourront être associés.
          </div>
          <Input type="file" multiple name="files" />
          <div className="text-sm mt-2">
            Vous pouvez attacher jusqu'à 50Mo de fichiers à la fois
          </div>
          <Button
            className="mt-2"
            type="submit"
            name="submit"
            id="submit"
            {...dataId('submit-button')}
          >
            Envoyer
          </Button>
        </form>
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(UploadLegacyModificationFiles);

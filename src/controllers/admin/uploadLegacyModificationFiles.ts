import { attachLegacyModificationFile, ensureRole } from '../../config';
import { UploadLegacyModificationFilesPage } from '../../views';
import { createReadStream } from 'fs';
import { addQueryParams } from '../../helpers/addQueryParams';
import { UploadLegacyModificationFileResult } from '../../views/pages/UploadLegacyModificationFilesPage';
import asyncHandler from '../helpers/asyncHandler';
import { upload } from '../upload';
import { v1Router } from '../v1Router';

import { PAGE_IMPORT_DOCUMENTS_HISTORIQUE } from '@potentiel/legacy-routes';

v1Router.get(
  PAGE_IMPORT_DOCUMENTS_HISTORIQUE,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(UploadLegacyModificationFilesPage({ request }));
  }),
);

v1Router.post(
  PAGE_IMPORT_DOCUMENTS_HISTORIQUE,
  ensureRole(['admin', 'dgec-validateur']),
  upload.multiple(),
  asyncHandler(async (request, response) => {
    if (!request.files || !request.files.length) {
      return response.redirect(
        addQueryParams(PAGE_IMPORT_DOCUMENTS_HISTORIQUE, {
          error: 'Merci de sélectionner au moins un fichier.',
          ...request.body,
        }),
      );
    }

    const results: UploadLegacyModificationFileResult[] = [];
    // @ts-ignore
    for (const file of request.files) {
      const filename = file.originalname;
      const contents = createReadStream(file.path);

      try {
        await attachLegacyModificationFile({ filename, contents, attachedBy: request.user });
        results.push({ filename, error: false });
      } catch (e) {
        results.push({ filename, error: true, message: e.message });
      }
    }

    return response.send(
      UploadLegacyModificationFilesPage({
        request,
        results,
      }),
    );
  }),
);

import { ensureRole, importProjects } from '@config';
import { UniqueEntityID } from '@core/domain';
import asyncHandler from '../helpers/asyncHandler';
import { addQueryParams } from '../../helpers/addQueryParams';
import { parseCsv } from '../../helpers/parseCsv';
import { IllegalProjectDataError } from '@modules/project';
import routes from '@routes';
import { upload } from '../upload';
import { v1Router } from '../v1Router';
import { AdminImporterCandidatsPage } from '@views';

v1Router.post(
  routes.IMPORT_PROJECTS_ACTION,
  ensureRole(['admin', 'dgec-validateur']),
  upload.single('candidats'),
  asyncHandler(async (request, response) => {
    if (!request.file || !request.file.path) {
      return response.redirect(
        addQueryParams(routes.IMPORT_PROJECTS, {
          error: 'Le fichier candidat est manquant.',
        }),
      );
    }

    // Parse the csv file
    const linesResult = await parseCsv(request.file.path, { delimiter: ';', encoding: 'win1252' });
    if (linesResult.isErr()) {
      const csvError = linesResult.error;
      return response.send(
        AdminImporterCandidatsPage({
          request,
          otherError: `Le fichier csv n'a pas pu être importé: ${csvError.message}`,
        }),
      );
    }

    const importId = new UniqueEntityID().toString();

    try {
      await importProjects({
        lines: linesResult.value,
        importedBy: request.user,
        importId,
      });

      return response.send(AdminImporterCandidatsPage({ request, isSuccess: true }));
    } catch (e) {
      if (e instanceof IllegalProjectDataError) {
        return response.send(AdminImporterCandidatsPage({ request, importErrors: e.errors }));
      }

      return response.send(AdminImporterCandidatsPage({ request, otherError: e.message }));
    }
  }),
);

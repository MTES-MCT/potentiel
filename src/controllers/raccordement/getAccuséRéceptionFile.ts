import { PermissionConsulterDossierRaccordement, formatIdentifiantProjet } from '@potentiel/domain';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { Project } from '@infra/sequelize/projectionsNext';
import { join } from 'path';
import { download, getFileExtension } from '@potentiel/file-storage';

const schema = yup.object({
  params: yup.object({
    projetId: yup.string().uuid().required(),
    reference: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_ACCUSE_RECEPTION_FILE(),
  vérifierPermissionUtilisateur(PermissionConsulterDossierRaccordement),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId, reference },
        query: { error },
      } = request;

      const projet = await Project.findByPk(projetId, {
        attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        période: projet.periodeId,
        famille: projet.familleId,
        numéroCRE: projet.numeroCRE,
      };

      try {
        const filePath = join(
          formatIdentifiantProjet(identifiantProjet),
          reference,
          `demande-complete-raccordement`,
        );

        const extension = await getFileExtension(filePath);
        const fileContent = await download(`${filePath}${extension}`);

        response.type(extension);
        fileContent.pipe(response);
        response.status(200);
      } catch (error) {}
    },
  ),
);

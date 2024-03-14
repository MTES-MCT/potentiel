import asyncHandler from '../helpers/asyncHandler';
import os from 'os';
import path from 'path';
import sanitize from 'sanitize-filename';
import {
  dgecEmail,
  eventStore,
  getModificationRequestDataForResponseTemplate,
  oldUserRepo,
  ensureRole,
} from '../../config';
import { User } from '../../entities';
import { fillDocxTemplate } from '../../helpers/fillDocxTemplate';
import {
  ModificationRequestDataForResponseTemplateDTO,
  ResponseTemplateDownloaded,
} from '../../modules/modificationRequest';
import { EntityNotFoundError } from '../../modules/shared';
import routes from '../../routes';
import { shouldUserAccessProject } from '../../useCases';
import { v1Router } from '../v1Router';
import { validateUniqueId } from '../../helpers/validateUniqueId';
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers';

v1Router.get(
  routes.TELECHARGER_MODELE_REPONSE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId, modificationRequestId } = request.params;

    if (!validateUniqueId(projectId) || !validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
    }

    // Verify that the current user has the rights to check this out
    if (!(await shouldUserAccessProject({ user: request.user, projectId }))) {
      return unauthorizedResponse({ request, response });
    }

    await getModificationRequestDataForResponseTemplate(
      modificationRequestId,
      request.user,
      dgecEmail,
    ).match(
      async (
        data: ModificationRequestDataForResponseTemplateDTO & {
          appelOffreId: string;
          periodeId: string;
        },
      ) => {
        if (data.status === 'envoyée' && data.type !== 'delai') {
          await eventStore.publish(
            new ResponseTemplateDownloaded({
              payload: {
                modificationRequestId,
                downloadedBy: request.user.id,
              },
            }),
          );
        }

        return response.download(
          path.resolve(process.cwd(), await makeResponseTemplate(data, request.user)),
        );
      },
      async (err): Promise<any> => {
        if (err instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        } else {
          return errorResponse({ request, response });
        }
      },
    );
  }),
);

const getTemplate = ({
  type,
  status,
}: {
  type: ModificationRequestDataForResponseTemplateDTO['type'];
  status: ModificationRequestDataForResponseTemplateDTO['status'];
}) => {
  switch (type) {
    case 'actionnaire':
      return 'Modèle réponse Changement Actionnaire - dynamique.docx';
    case 'delai':
      return 'Modèle réponse Prolongation de délai - dynamique.docx';
    case 'producteur':
      return 'Modèle réponse Changement Producteur - dynamique.docx';
    case 'puissance':
      return 'Modèle réponse Puissance - dynamique.docx';
    case 'recours':
      return 'Modèle réponse Recours gracieux - dynamique.docx';
  }
};

async function makeResponseTemplate(
  data: ModificationRequestDataForResponseTemplateDTO & { appelOffreId: string; periodeId: string },
  user: User,
): Promise<string> {
  const { appelOffreId, periodeId, ...données } = data;

  const initials = user.fullName
    .split(' ')
    .map((n) => n.slice(0, 1))
    .join('')
    .toUpperCase();
  const type = données.type.charAt(0).toUpperCase() + données.type.slice(1);

  const nomDeFichier = `${new Date().getFullYear()}-XXX - ${initials} - ${type} ${appelOffreId.toUpperCase()} T${periodeId.toUpperCase()} - ${données.nomCandidat.toUpperCase()} - ${données.nomProjet.toUpperCase()}.docx`;

  const filepath = path.join(os.tmpdir(), sanitize(nomDeFichier));

  const templatePath = path.resolve(
    __dirname,
    '..',
    '..',
    'views',
    'template',
    getTemplate({
      type: données.type,
      status: données.status,
    }),
  );

  let imageToInject = '';
  if (user.role === 'dreal') {
    const userDreals = await oldUserRepo.findDrealsForUser(user.id);
    if (userDreals.length) {
      const [dreal] = userDreals;
      imageToInject = path.resolve(__dirname, '../../public/images/dreals', `${dreal}.png`);
      données.suiviParEmail = user.email;
      données.dreal = dreal;
    }
  }

  // If there are multiple, use the first to coincide with the project
  await fillDocxTemplate({
    templatePath,
    outputPath: filepath,
    injectImage: imageToInject,
    variables: données,
  });

  return filepath;
}

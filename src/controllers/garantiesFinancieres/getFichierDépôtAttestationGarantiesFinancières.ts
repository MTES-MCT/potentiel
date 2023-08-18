import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, unauthorizedResponse, vérifierPermissionUtilisateur } from '../helpers';
import { ConsulterFichierDépôtAttestationGarantiesFinancièreQuery } from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import {
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
  PermissionConsulterGarantiesFinancières,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { logger } from '../../core/utils';
import { extension } from 'mime-types';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(),
  vérifierPermissionUtilisateur(PermissionConsulterGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const fichierAttestation =
        await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
          type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        });

      if (isNone(fichierAttestation)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Fichier attestation',
        });
      }

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      if (user.role === 'porteur-projet') {
        const porteurAAccèsAuProjet = !!(await UserProjects.findOne({
          where: { projectId: projet.id, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      const extensionFichier = extension(fichierAttestation.format);
      logger.info(`Extension fichier: ${extensionFichier}`);

      const fileName = `attestation.${extensionFichier}`;
      logger.info(fileName);

      response.type(fichierAttestation.format);
      response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      fichierAttestation.content.pipe(response);

      return response.status(200);
    },
  ),
);

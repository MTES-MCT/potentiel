import fs from 'fs';
import omit from 'lodash/omit';
import * as yup from 'yup';

import { Option } from '@potentiel-libraries/monads';
import { ensureRole, changerProducteur } from '../../../config';
import { logger } from '../../../core/utils';
import { UnauthorizedError } from '../../../modules/shared';
import routes from '../../../routes';

import { addQueryParams } from '../../../helpers/addQueryParams';
import {
  errorResponse,
  isSoumisAuxGF,
  notFoundResponse,
  unauthorizedResponse,
} from '../../helpers';
import { upload } from '../../upload';
import { v1Router } from '../../v1Router';
import { ChangementProducteurImpossiblePourEolienError } from '../../../modules/project/errors';
import { NouveauCahierDesChargesNonChoisiError } from '../../../modules/demandeModification';
import safeAsyncHandler from '../../helpers/safeAsyncHandler';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Project } from '../../../infra/sequelize';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { mediator } from 'mediateur';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { ListerPorteursQuery } from '@potentiel-domain/utilisateur';
import { Accès, Lauréat } from '@potentiel-domain/projet';

const schema = yup.object({
  body: yup.object({
    projetId: yup.string().uuid().required(),
    producteur: yup.string().required('Le champ "nouveau producteur" est obligatoire.'),
    justification: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_CHANGER_PRODUCTEUR,
  upload.single('file'),
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.GET_CHANGER_PRODUCTEUR(request.body.projetId), {
            ...omit(request.body, 'projectId'),
            error: `${error.errors.join(' ')}`,
          }),
        );
      },
    },
    async (request, response) => {
      if (request.errorFileSizeLimit) {
        return response.redirect(
          addQueryParams(routes.GET_CHANGER_PRODUCTEUR(request.body.projetId), {
            error: request.errorFileSizeLimit,
          }),
        );
      }

      const { user } = request;
      const { projetId, justification, producteur } = request.body;

      const fichier = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      };

      try {
        await changerProducteur({
          porteur: user,
          projetId,
          ...(fichier && { fichier }),
          ...(justification && { justification }),
          nouveauProducteur: producteur,
        });

        const projet = await Project.findByPk(projetId);
        if (!projet) {
          return notFoundResponse({ request, response });
        }
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(
          `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
        );

        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: { identifiantAppelOffre: projet.appelOffreId },
        });

        if (Option.isNone(appelOffre)) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' });
        }

        await renouvelerGarantiesFinancières(identifiantProjet, appelOffre, user.email);
        await retirerTousAccès(identifiantProjet.formatter());

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Votre changement de producteur a bien été enregistré. Vous n'avez plus accès au projet sur Potentiel.`,
            redirectUrl: routes.LISTE_PROJETS,
            redirectTitle: 'Retourner à la liste des mes projets',
          }),
        );
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response });
        }

        if (
          error instanceof ChangementProducteurImpossiblePourEolienError ||
          error instanceof NouveauCahierDesChargesNonChoisiError
        ) {
          return errorResponse({
            request,
            response,
            customMessage: error.message,
          });
        }

        logger.error(error);
        return errorResponse({
          request,
          response,
          customMessage:
            'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
        });
      }
    },
  ),
);

/** Si le projet est soumis aux GF, effacer les eventuelles GF existantes et en redemander */
const renouvelerGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel,
  identifiantUtilisateur: string,
) => {
  if (
    !isSoumisAuxGF({
      appelOffres: appelOffre,
      famille: identifiantProjet.famille,
      période: identifiantProjet.période,
    })
  ) {
    logger.info("Le projet n'est pas soumis aux Garanties Financières");
    return;
  }
  const dateActuelle = DateTime.now().date;

  const garantiesFinancières =
    await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

  if (Option.isSome(garantiesFinancières)) {
    await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        effacéLeValue: dateActuelle.toISOString(),
        effacéParValue: identifiantUtilisateur,
      },
    });
  }

  await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
    type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
    data: {
      demandéLeValue: dateActuelle.toISOString(),
      identifiantProjetValue: identifiantProjet.formatter(),
      dateLimiteSoumissionValue: new Date(
        dateActuelle.setMonth(dateActuelle.getMonth() + 2),
      ).toISOString(),
      motifValue:
        Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur.motif,
    },
  });
};

/** Retirer les accès de tous les porteurs ayant accès au projet */
const retirerTousAccès = async (identifiantProjet: string) => {
  try {
    const porteurs = await mediator.send<ListerPorteursQuery>({
      type: 'Utilisateur.Query.ListerPorteurs',
      data: { identifiantProjet },
    });
    for (const porteur of porteurs.items) {
      await mediator.send<Accès.RetirerAccèsProjetUseCase>({
        type: 'Projet.Accès.UseCase.RetirerAccèsProjet',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: porteur.email,
          retiréLeValue: DateTime.now().formatter(),
          retiréParValue: Email.system().formatter(),
          cause: 'changement-producteur',
        },
      });
    }
  } catch (error) {
    logger.error(
      new Error('Impossible de retirer les accès aux porteurs suite au changement de producteur', {
        cause: error,
      }),
    );
  }
};

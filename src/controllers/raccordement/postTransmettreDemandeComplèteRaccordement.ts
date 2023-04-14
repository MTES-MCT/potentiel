import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  formatIdentifiantProjet,
  listerGestionnaireRéseauQueryHandlerFactory,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementUseCaseFactory,
} from '@potentiel/domain';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import routes from '@routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { iso8601DateToDateYupTransformation, notFoundResponse } from '../helpers';
import { TransmettreDemandeComplèteRaccordementPage } from '@views';
import { Project } from '@infra/sequelize/projectionsNext';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';

const transmettreDemandeComplèteRaccordementCommand =
  transmettreDemandeComplèteRaccordementCommandHandlerFactory({
    loadAggregate,
    publish,
  });

const consulterGestionnaireRéseauQuery = consulterGestionnaireRéseauQueryHandlerFactory({
  find: findProjection,
});
const transmettreDemandeComplèteRaccordement = transmettreDemandeComplèteRaccordementUseCaseFactory(
  {
    transmettreDemandeComplèteRaccordementCommand,
    consulterGestionnaireRéseauQuery,
  },
);

const schema = yup.object({
  params: yup.object({ projetId: yup.string().uuid().required() }),
  body: yup.object({
    codeEIC: yup.string().required(),
    référenceDossierRaccordement: yup.string().required(),
    dateQualification: yup
      .date()
      .required(`La date de qualification est obligatoire`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de qualification n'est pas valide`),
  }),
});

v1Router.post(
  routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT(),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { projetId },
        body: { codeEIC, dateQualification, référenceDossierRaccordement },
      } = request;

      const projet = await Project.findByPk(projetId);

      if (projet) {
        // Check user rights

        const identifiantProjet = {
          appelOffre: projet.appelOffreId,
          période: projet.periodeId,
          famille: projet.familleId,
          numéroCRE: projet.numeroCRE,
        };

        await transmettreDemandeComplèteRaccordement({
          identifiantProjet,
          identifiantGestionnaireRéseau: { codeEIC },
          dateQualification,
          référenceDossierRaccordement,
        });

        return response.redirect(routes.GET_LISTE_DOSSIERS_RACCORDEMENT(projetId));
      }
    },
  ),
);

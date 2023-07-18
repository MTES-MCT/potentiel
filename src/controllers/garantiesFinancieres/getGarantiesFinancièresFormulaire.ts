import routes from '@routes';
import { vérifierPermissionUtilisateur } from '../helpers';
import { v1Router } from '../v1Router';
import asyncHandler from '../helpers/asyncHandler';
import { FormulaireGarantiesFinancieresPage } from '@views';
import { PermissionTransmettreGarantiesFinancières } from '@modules/project';

v1Router.get(
  routes.GET_TRANSMETTRE_GARANTIES_FINANCIERES_PAGE(),
  vérifierPermissionUtilisateur(PermissionTransmettreGarantiesFinancières),
  asyncHandler(async (request, response) => {
    const {
      user,
      query: { error },
    } = request;

    return response.send(
      FormulaireGarantiesFinancieresPage({
        user,
        error: error as string,
        projet: {
          appelOffre: 'PPE2 - Eolien',
          période: '1',
          famille: '',
          identifiantProjet: 'id#id#id#id',
          localité: { commune: 'Paris', département: 'Paris', région: 'IDF' },
          nom: 'CentralePV',
          numéroCRE: 'CRE1',
          statut: 'classé',
          type: 'projet',
        },
      }),
    );
  }),
);
